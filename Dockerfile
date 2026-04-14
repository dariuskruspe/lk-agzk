FROM nginx:alpine

ARG path

RUN rm -rf /usr/share/nginx/html/* \
    rm /etc/nginx/conf.d/default.conf

COPY ${path}/assets/dhparam.pem /etc/nginx/

COPY ${path}/assets/lk-zup.conf.template /etc/nginx/templates/

COPY ${path}/assets/lk-zup-ssl.conf.template /etc/nginx/templates/

COPY ${path} /usr/share/nginx/lk-zup

COPY ${path}/assets/delete-odd-config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/delete-odd-config.sh

EXPOSE 80 443

ENV VAR_DOMAIN_NAME localhost
ENV VAR_PROXY_URL http://localhost:8080
ENV VAR_API_DOMAIN localhost
ENV VAR_API_IP 127.0.0.1

CMD ["nginx", "-g", "daemon off;"]
