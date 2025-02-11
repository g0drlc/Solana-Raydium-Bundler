use tonic_build::configure;

fn main() {
    configure()
        .type_attribute(
            "TransactionErrorType",
            "#[cfg_attr(test, derive(enum_iterator::Sequence))]",
        )
        .type_attribute(
            "InstructionErrorType",
            "#[cfg_attr(test, derive(enum_iterator::Sequence))]",
        )
        .compile(
            &[
                "proto/geyser.proto",
                "proto/confirmed_block.proto",
                "proto/transaction_by_addr.proto",
            ],
            &["proto"],
        )
        .unwrap();
}
