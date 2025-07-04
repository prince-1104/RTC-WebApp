-- DropForeignKey
ALTER TABLE "DrawEvent" DROP CONSTRAINT "DrawEvent_roomId_fkey";

-- DropForeignKey
ALTER TABLE "DrawEvent" DROP CONSTRAINT "DrawEvent_userId_fkey";

-- AddForeignKey
ALTER TABLE "DrawEvent" ADD CONSTRAINT "DrawEvent_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawEvent" ADD CONSTRAINT "DrawEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
