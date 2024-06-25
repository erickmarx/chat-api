/*
  Warnings:

  - You are about to drop the `ProfileConversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileConversation" DROP CONSTRAINT "ProfileConversation_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileConversation" DROP CONSTRAINT "ProfileConversation_historyId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileConversation" DROP CONSTRAINT "ProfileConversation_profileId_fkey";

-- DropTable
DROP TABLE "ProfileConversation";

-- CreateTable
CREATE TABLE "ConversationOnProfile" (
    "id" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "historyId" TEXT,

    CONSTRAINT "ConversationOnProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationOnProfile_historyId_key" ON "ConversationOnProfile"("historyId");

-- AddForeignKey
ALTER TABLE "ConversationOnProfile" ADD CONSTRAINT "ConversationOnProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationOnProfile" ADD CONSTRAINT "ConversationOnProfile_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationOnProfile" ADD CONSTRAINT "ConversationOnProfile_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("id") ON DELETE SET NULL ON UPDATE CASCADE;
