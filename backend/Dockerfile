FROM php:8.3-apache

RUN docker-php-ext-install pdo_mysql \
    && a2enmod headers

COPY . /var/www/html/
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html/uploads

COPY docker-entrypoint.sh /usr/local/bin/netcheck-entrypoint
RUN chmod +x /usr/local/bin/netcheck-entrypoint
ENTRYPOINT ["netcheck-entrypoint"]

EXPOSE 80
