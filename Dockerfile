# Use the official PHP 8.2 image with Apache
FROM php:8.2-apache

# Install the necessary PHP extensions to connect to your Aiven MySQL database
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache's mod_rewrite (useful for routing in many PHP apps)
RUN a2enmod rewrite

# Copy your application files into the container's web directory
COPY . /var/www/html/

# Set the correct permissions for Apache
RUN chown -R www-data:www-data /var/www/html/

# Expose port 80 for Render's web traffic
EXPOSE 80