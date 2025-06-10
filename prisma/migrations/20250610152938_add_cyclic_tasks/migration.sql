-- CreateTable
CREATE TABLE "CyclicTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "lastCompletedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CyclicTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CyclicTask" ADD CONSTRAINT "CyclicTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
