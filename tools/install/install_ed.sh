#!/bin/bash

if [[ "$1" == "help" ]]; then
  echo "Usage: bash ./install_ed.sh [options]"
  echo "Example: bash ./install_ed.sh -l https://nc.9958258.ru/lk-zup.ru -d /var/www/lk-zup_prod"
  echo "Options:"
  echo "  -d  Directory to install the app to. Default: /var/www/lk-zup"
  echo "  -n  [unrequired, need to install nginx] Nginx configuration file name. Default: none"
  echo "  -l  [unrequired, need if an archive name isn't 'lk-zup.zip' or it's a link] Link to the archive with the app or lint from the internet. Default: lk-zup.zip"
  echo "  -c  [unrequired, need to set nginx config] Path to the ssl certificate file. Default: none"
  echo "  -k  [unrequired, need to set nginx config] Path to the ssl key file. Default: none"
  echo "  -b  [unrequired, need to set nginx config] Domain name of DB's server (i.e. empl.wagroup.ru). Default: none"
  echo "  -a  [unrequired, need to set nginx config] DB publication address (i.e. http://empl.wagroup.ru/zup_new). Please, assure of accessibility this publication using the next link into a browser: <PUBLICATION_ADDRESS>/hs/employeeService/wa_global/settings. Default: none"
  echo "  -i  [unrequired, need to set nginx config] DB's server ip-address to match it with this domain name. Default: none"
  echo "  -f  [unrequired, need to set nginx config] Frontend server domain name. Default: none"
  echo "  -s  [unrequired, need to set nginx config] Secure port for HTTPS. Default: 443"
  echo "  -p  [unrequired, need to set nginx config] Port. Default: 80"
  exit 0
fi

while getopts d:n:l:c:k:b:a:i:f:s:p: flag
do
    case "${flag}" in
        d) dir=${OPTARG};;
        n) nginx=${OPTARG};;
        l) link=${OPTARG};;
	      c) cert=${OPTARG};;
        k) key=${OPTARG};;
        b) basedomain=${OPTARG};;
        a) basepublic=${OPTARG};;
	      i) ipbaseaddr=${OPTARG};;
	      f) frontdomain=${OPTARG};;
        s) secureport=${OPTARG};;
        p) port=${OPTARG};;
    esac
done

if [[ "$link" == "http"* ]]; then
  echo 'Downloading files...'
  sudo wget -O lk-zup.zip $link
  link="lk-zup.zip"
fi
if [[ -z "$link" ]]; then
  link="lk-zup.zip"
fi

sudo apt update -qq
sudo apt install -y -qq unzip

echo 'Replacing old directory to the new one...'
sudo cp $link /var/www/
if [[ -z "$dir" ]]; then
  dir=/var/www/lk-zup
fi
if [[ -d $dir ]]; then
  echo 'Creating backup directory...'
  sudo rm -rf ${dir}_backup
  sudo mv $dir ${dir}_backup
fi
echo 'Extracting files from archive...'
sudo mkdir -p $dir
sudo unzip $link -d $dir
sudo mv ${dir}/lk-zup/* ${dir}/
rm -rf ${dir}/lk-zup
echo 'Files were replaced successfully!'

if [[ -n "$nginx" ]]; then
  echo 'Installing nginx...'
  sudo apt update
  sudo apt install -y -qq nginx

  if [[ -z "$cert" ]] || [[ -z "$key" ]]; then
    if [[ -z "$secureport" ]]; then
      secureport=443
    fi
    if [[ -z "$port" ]]; then
      port=80
    fi

    if [[ -n "basedomain" ]] && [[ -n "basepublic" ]] && [[ -n "ipbaseaddr" ]] && [[ -n "frontdomain" ]]; then
      echo 'Creating nginx http configuration...'
      cat > /etc/nginx/sites-available/${nginx} << EOF
upstream $basedomain {
    server $ipbaseaddr;
}

server {
    listen $port;
    
    server_name $frontdomain;
    
    location /data/ {
        proxy_pass_header Content-Type;
        proxy_pass ${basepublic}/hs/employeeService/;
        proxy_ssl_verify off;
    }
    
    location /api/ {
        proxy_pass_header Content-Type;
        proxy_pass ${basepublic}/hs/employeeService/;
        proxy_ssl_verify off;
    }
  
    location / {
        root $dir;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
}
EOF
      echo 'Nginx configuration was created!'
    else
      echo "Nginx http configuration wasn't created! You need to add flags -b, -i, -a, -f to create it."
    fi
  else
    if [[ -n "basedomain" ]] && [[ -n "basepublic" ]] && [[ -n "ipbaseaddr" ]] && [[ -n "frontdomain" ]]; then
      echo 'Creating nginx https configuration...'
      cat > /etc/nginx/sites-available/${nginx} << EOF
upstream $basedomain {
    server ${ipbaseaddr}:${secureport};
}

server {
    listen $port;

    server_name $frontdomain;

    return 301 https://\$host\$request_uri;
}

server {
    listen $secureport ssl;

    server_name $frontdomain;

    ssl_certificate ${sslcerts}.cer;
    ssl_certificate_key ${sslcerts}.key;
    
    location /data/ {
        proxy_pass_header Content-Type;
        proxy_pass ${basepublic}/hs/employeeService/;
    }

    location /api/ {
        proxy_pass_header Content-Type;
        proxy_pass ${basepublic}/hs/employeeService/;
    }

    location / {
        root $dir;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
}
EOF
      echo 'Nginx configuration was created!'
    else
      echo "Nginx https configuration wasn't created! You need to add flags -c, -k, -b, -i, -a, -f to create it."
    fi
  fi

  sudo ln -s /etc/nginx/sites-available/$nginx /etc/nginx/sites-enabled/
  sudo service nginx reload
  echo 'Nginx successfully installed!'
fi

exit 0
