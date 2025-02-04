CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50) NOT NULL,
    "createdAt" DATE DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN DEFAULT false,
    "adminId" UUID NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "messageBody" TEXT NOT NULL,
    "createdAt" DATE DEFAULT CURRENT_TIMESTAMP,
    "parentMessageId" UUID,
    "expiryDate" DATE,
    "creatorId" UUID NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupMessage" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "group_id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageRecipient" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "recipientId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    "messageId" UUID NOT NULL,

    CONSTRAINT "MessageRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "picture" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dlygf7xye/image/upload/v1736098504/00721c9db2261d4ab0f9528ba9f3c7f2e70f5330.png',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FriendshipRequest" (
    "userId" UUID NOT NULL,
    "friendId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "public"."AcceptedFriendship" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId1" UUID NOT NULL,
    "userId2" UUID NOT NULL,

    CONSTRAINT "AcceptedFriendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE INDEX "FriendshipRequest_userId_idx" ON "public"."FriendshipRequest"("userId");

-- CreateIndex
CREATE INDEX "FriendshipRequest_friendId_idx" ON "public"."FriendshipRequest"("friendId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendshipRequest_userId_friendId_key" ON "public"."FriendshipRequest"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "AcceptedFriendship_userId1_userId2_key" ON "public"."AcceptedFriendship"("userId1", "userId2");

-- CreateIndex
CREATE UNIQUE INDEX "AcceptedFriendship_userId2_userId1_key" ON "public"."AcceptedFriendship"("userId2", "userId1");

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "ChatGroup_admin_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageRecipient" ADD CONSTRAINT "ChatGroup_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."MessageRecipient" ADD CONSTRAINT "MessageRecipient_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."MessageRecipient" ADD CONSTRAINT "MessageRecipient_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."FriendshipRequest" ADD CONSTRAINT "FriendshipRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendshipRequest" ADD CONSTRAINT "FriendshipRequest_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AcceptedFriendship" ADD CONSTRAINT "AcceptedFriendship_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AcceptedFriendship" ADD CONSTRAINT "AcceptedFriendship_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
