/*
  Warnings:

  - You are about to alter the column `perfil` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `usuario` MODIFY `perfil` ENUM('CAIXA', 'GERENTE', 'ADMIN') NOT NULL;
