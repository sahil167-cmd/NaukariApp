-- =============================================================================
-- Naukari Bazaar Database Schema (MySQL / MariaDB)
-- Production Ready for GoDaddy Shared Hosting
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `contact_logs`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Table: `users`
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(15) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Worker',
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `registration_complete` TINYINT(1) NOT NULL DEFAULT 0,
  `registration_number` VARCHAR(30) NULL UNIQUE,
  `registration_date` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: `profiles`
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `completion_percentage` INT NOT NULL DEFAULT 0,
  `first_name` VARCHAR(50) NULL,
  `last_name` VARCHAR(50) NULL,
  `gender` VARCHAR(20) NULL,
  `dob` VARCHAR(20) NULL,
  `personal_phone` VARCHAR(15) NULL,
  `languages` TEXT NULL,
  `state` VARCHAR(100) NULL,
  `city` VARCHAR(100) NULL,
  `district` VARCHAR(100) NULL,
  `pincode` VARCHAR(10) NULL,
  `job_categories` TEXT NULL,
  `salary_range` VARCHAR(50) NULL,
  `shift_preference` VARCHAR(50) NULL,
  `immediately_available` TINYINT(1) NOT NULL DEFAULT 1,
  `education_level` VARCHAR(100) NULL,
  `education_school_name` VARCHAR(150) NULL,
  `education_passing_year` INT NULL,
  `experience_data` TEXT NULL,
  `documents_data` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: `jobs`
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `company` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `salary` VARCHAR(50) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `urgent_hiring` TINYINT(1) NOT NULL DEFAULT 0,
  `posted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_jobs_category` (`category`),
  INDEX `idx_jobs_posted_at` (`posted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: `contact_logs`
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `action_type` VARCHAR(20) NOT NULL,
  `device` VARCHAR(50) NOT NULL DEFAULT 'Mobile',
  `platform` VARCHAR(50) NOT NULL DEFAULT 'unknown',
  `status` VARCHAR(20) NOT NULL DEFAULT 'completed',
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_contact_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_contact_logs_user_timestamp` (`user_id`, `timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Initial Catalog Seed Data for `jobs`
-- =============================================================================
INSERT INTO `jobs` (`title`, `company`, `location`, `salary`, `category`, `type`, `description`, `is_verified`, `urgent_hiring`, `posted_at`) VALUES
('Experienced House Maid', 'Home Care Services', 'Mumbai, Maharashtra', '₹12,000 - ₹15,000 / month', 'House Maid', 'Full Time', 'Looking for an experienced full-time house maid for daily household chores, cleaning, and cooking assistance.', 1, 1, NOW()),
('Baby Sitter / Nanny', 'Caretakers India', 'Pune, Maharashtra', '₹15,000 - ₹18,000 / month', 'Baby Sitter', 'Full Time', 'Urgent requirement for a friendly and caring baby sitter to manage a 2-year-old child during day hours.', 1, 1, NOW()),
('Office Boy / Peon', 'Apex Enterprises', 'Thane, Maharashtra', '₹10,000 - ₹12,000 / month', 'Office Boy', 'Full Time', 'Office assistant required for pantry management, document handling, and general errands.', 1, 0, NOW()),
('Patient Care Assistant', 'HealthCare At Home', 'Navi Mumbai, Maharashtra', '₹14,000 - ₹18,000 / month', 'Patient Care', 'Shift Work', 'Qualified or experienced patient care attendant for elderly care taking.', 1, 1, NOW()),
('Home Cook (North & South Indian)', 'Private Household', 'Andheri, Mumbai', '₹16,000 - ₹20,000 / month', 'Cook', 'Part Time', 'Experienced home cook needed to prepare breakfast and dinner for a family of 4.', 1, 0, NOW());
