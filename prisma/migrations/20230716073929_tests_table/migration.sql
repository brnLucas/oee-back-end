-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "tx_card_id" TEXT NOT NULL,
    "dt_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tx_result" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);
