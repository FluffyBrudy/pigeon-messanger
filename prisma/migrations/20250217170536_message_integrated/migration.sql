-- AlterTable
ALTER TABLE "public"."Message" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "public"."MessageRecipient" ALTER COLUMN "groupId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Message_creatorId_idx" ON "public"."Message"("creatorId");

-- CreateIndex
CREATE INDEX "MessageRecipient_recipientId_idx" ON "public"."MessageRecipient"("recipientId");
