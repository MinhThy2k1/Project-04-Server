-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(50) NOT NULL,
    `email` CHAR(50) NOT NULL,
    `emailConfirm` BOOLEAN NOT NULL DEFAULT false,
    `password` CHAR(255) NOT NULL,
    `role` ENUM('admin', 'member') NOT NULL DEFAULT 'member',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `avatar` TEXT NOT NULL,
    `createAt` VARCHAR(191) NOT NULL,
    `updateAt` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `ipList` VARCHAR(191) NOT NULL DEFAULT '[]',

    UNIQUE INDEX `users_userName_key`(`userName`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `des` VARCHAR(191) NOT NULL DEFAULT 'dang cap nhat',
    `sellStatus` BOOLEAN NOT NULL DEFAULT false,
    `destroy` BOOLEAN NOT NULL DEFAULT false,
    `avatar` LONGTEXT NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `hide` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pictures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` LONGTEXT NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `pictures_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `createAt` VARCHAR(191) NOT NULL,
    `updateAt` VARCHAR(191) NOT NULL,
    `payMode` ENUM('cash', 'zalo_pay') NULL DEFAULT 'cash',
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `paidAt` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `status` ENUM('shopping', 'pending', 'accepted', 'shipping', 'done') NOT NULL DEFAULT 'shopping',
    `pending` VARCHAR(191) NULL,
    `acceptAt` VARCHAR(191) NULL,
    `shippingAt` VARCHAR(191) NULL,
    `doneAt` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipt_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receiptId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_details` ADD CONSTRAINT `receipt_details_receiptId_fkey` FOREIGN KEY (`receiptId`) REFERENCES `receipts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_details` ADD CONSTRAINT `receipt_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
