-- To implement change DB to your db name

-- Users
CREATE TABLE IF NOT EXISTS DB.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(64),
    profile_picture VARCHAR(128),
    biography TEXT,
    date_of_birth DATE,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    privacy_settings BOOLEAN DEFAULT TRUE,
    notification_preferences BOOLEAN DEFAULT TRUE,
    verification_status BOOLEAN DEFAULT FALSE,
    moderator_status BOOLEAN DEFAULT FALSE,
    activity_history_id TEXT,
    verification_token VARCHAR(56)
);

-- Quotes
CREATE TABLE IF NOT EXISTS DB.quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quote_text TEXT,
    author VARCHAR(32),
    image_url VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    visibility ENUM('public', 'private') DEFAULT 'public',
    FOREIGN KEY (user_id) REFERENCES DB.users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Likes
CREATE TABLE IF NOT EXISTS DB.likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quote_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES DB.users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (quote_id) REFERENCES DB.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Comments
CREATE TABLE IF NOT EXISTS DB.comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quote_id INT,
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES DB.users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (quote_id) REFERENCES DB.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tags/Categories 
CREATE TABLE IF NOT EXISTS DB.tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255),
    custom BOOLEAN DEFAULT FALSE
);

-- QuotesTags
CREATE TABLE IF NOT EXISTS DB.quotes_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT,
    tag_id INT,
    FOREIGN KEY (quote_id) REFERENCES DB.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES DB.tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Reports
CREATE TABLE IF NOT EXISTS DB.reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_user_id INT,
    reported_quote_id INT,
    report_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_user_id) REFERENCES DB.users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (reported_quote_id) REFERENCES DB.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tags and Users relationship
CREATE TABLE IF NOT EXISTS DB.tags_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tag_id INT,
    FOREIGN KEY (user_id) REFERENCES DB.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES DB.tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);
