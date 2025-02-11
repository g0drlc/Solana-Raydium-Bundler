use tonic::{service::Interceptor, Status};

#[derive(Clone)]
pub struct GrpcInterceptor {
    pub access_token: String,
}

impl Interceptor for GrpcInterceptor {
    fn call(&mut self, mut request: tonic::Request<()>) -> Result<tonic::Request<()>, Status> {
        request
            .metadata_mut()
            .insert("access-token", self.access_token.parse().unwrap());
        Ok(request)
    }
}
