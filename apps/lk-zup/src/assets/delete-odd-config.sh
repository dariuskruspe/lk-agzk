#!/bin/sh

if [[ -z "${VAR_SSL}" ]]; then
  rm -f /etc/nginx/templates/lk-zup-ssl.conf.template
  rm -f /etc/nginx/conf.d/lk-zup-ssl.conf
else
  rm -f /etc/nginx/templates/lk-zup.conf.template
  rm -f /etc/nginx/conf.d/lk-zup.conf
fi

exit 0
