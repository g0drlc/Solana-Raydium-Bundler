use std::{
    fmt::Display,
    pin::Pin,
    task::{Context, Poll},
};

use log::*;
use tokio::sync::{mpsc::Receiver, oneshot};
use tokio_stream::{wrappers::ReceiverStream, Stream};
use tonic::Status;

/// Used to notify another process when a client's subscription is closed.
/// This is useful especially when you want to clean up some state associated with a stream.
pub struct SubscriptionStream<ID: Clone + Display + Send, T> {
    /// Inner stream object.
    inner: ReceiverStream<Result<T, Status>>,

    /// Inner channel used to signal tokio task when connection is dropped.
    /// NOTE: Wrapped in an Option b/c oneshot Sender takes ownership of the object
    /// on calls to `send`. So we call take on the Option to avoid using `mem::replace`.
    stream_closed_signal: Option<oneshot::Sender<()>>,

    /// Stream's unique id.
    stream_id: ID,

    /// Name of this stream.
    name: &'static str,
}

pub trait StreamClosedSender<E: Send + 'static>: Send + 'static {
    type Error: Display;
    fn send(&self, event: E) -> Result<(), Self::Error>;
}

impl<ID: Clone + Display + Send + 'static, T> SubscriptionStream<ID, T> {
    pub fn new<E: Send + 'static, S: StreamClosedSender<E>>(
        // Channel where streamed data flows thru.
        stream_rx: Receiver<Result<T, Status>>,
        // The stream's id.
        stream_id: ID,
        // Channel used to notify other process that stream was closed along
        // with arbitrary event that gets sent.
        (stream_closed_event_sender, event): (S, E),
        stream_name: &'static str,
    ) -> Self {
        let (stream_closed_signal, stream_disconnected_rx) = oneshot::channel();
        let c_stream_id = stream_id.clone();
        tokio::spawn(async move {
            let _ = stream_disconnected_rx.await;
            if let Err(e) = stream_closed_event_sender.send(event) {
                error!(
                    "error cleaning up {} subscription: [error={}, stream_id={}]",
                    stream_name, e, c_stream_id
                );
            }
        });

        Self {
            inner: ReceiverStream::new(stream_rx),
            stream_closed_signal: Some(stream_closed_signal),
            name: stream_name,
            stream_id,
        }
    }
}

impl<ID: Clone + Display + Send, T> Stream for SubscriptionStream<ID, T> {
    type Item = Result<T, Status>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        Pin::new(&mut self.inner).poll_next(cx)
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.inner.size_hint()
    }
}

impl<ID: Clone + Display + Send, T> Drop for SubscriptionStream<ID, T> {
    fn drop(&mut self) {
        debug!(
            "closing {} stream: [stream_id={}]",
            self.name, self.stream_id
        );

        let stream_closed_signal = self
            .stream_closed_signal
            .take()
            .unwrap_or_else(|| panic!("{} stream_disconnected_tx cannot be None", self.name));
        if stream_closed_signal.send(()).is_err() {
            warn!("{} stream_disconnected_tx send failure", self.name);
        }
    }
}

impl<ID: Clone + Display + Send, T> Unpin for SubscriptionStream<ID, T> {}
