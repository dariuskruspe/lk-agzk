Param (
  [string]$dir = 'C:\nginx\lk-zup',
  [string]$nginxconf = '',
  [string]$nginxlink = '',
  [string]$nginxdir = 'C:\nginx',
  [string]$link = 'lk-zup.zip',
  [string]$cert = '',
  [string]$key = '',
  [string]$basedomain = '',
  [string]$basepublic = '',
  [string]$ipbaseaddr = '',
  [string]$frontdomain = '',
  [int]$secureport = 443,
  [int]$port = 80
)

# if ($args[0] -eq "help") {
#   Write-Output "Usage: powershell .\install_ed.ps1 [options]"
#   Write-Output "Example: powershell .\install_ed.ps1 -link https://nc.9958258.ru/lk-zup.ru -dir C:\nginx\lk-zup_prod"
#   Write-Output "Options:"
#   Write-Output "  -dir  Directory to install the app to. Default: C:\nginx\lk-zup"
#   Write-Output "  -nginxconf    [unrequired, need to install nginx] Nginx configuration file name. Default: lk-zup.conf"
#   Write-Output "  -nginxlink    [unrequired, need to install nginx] Link to get nginx. Default: nginx.zip"
#   Write-Output "  -nginxdir     [unrequired, need to install nginx] Directory where to install nginx. Default: C:\nginx"
#   Write-Output "  -link         [unrequired, need if an archive name isn't 'lk-zup.zip' or it's a link] Link to the archive with the app or lint from the internet. Default: lk-zup.zip"
#   Write-Output "  -cert         [unrequired, need to set nginx https config] Path to the ssl certificate file. Default: none"
#   Write-Output "  -key          [unrequired, need to set nginx https config] Path to the ssl key file. Default: none"
#   Write-Output "  -basedomain   [unrequired, need to set nginx config] Domain name of DB's server (i.e. empl.wagroup.ru). Default: none"
#   Write-Output "  -basepublic   [unrequired, need to set nginx config] DB publication address (i.e. http://empl.wagroup.ru/zup_new). Please, assure of accessibility this publication using the next link into a browser: <PUBLICATION_ADDRESS>/hs/employeeService/wa_global/settings. Default: none"
#   Write-Output "  -ipbaseaddr   [unrequired, need to set nginx config] DB's server ip-address to match it with this domain name. Default: none"
#   Write-Output "  -frontdomain  [unrequired, need to set nginx config] Frontend server domain name. Default: none"
#   Write-Output "  -secureport   [unrequired, need to set nginx https config] Secure port for HTTPS. Default: 443"
#   Write-Output "  -port         [unrequired, need to set nginx config] Port. Default: 80"
#   Exit 0
# }

if ($nginxconf -ne '' -and $nginxlink -ne '') {
  Write-Output 'Installing nginx...'

  if ($nginxlink -like "http*") {
    Write-Output 'Downloading nginx...'
    Invoke-WebRequest -OutFile "nginx.zip" $nginxlink
    $nginxlink = "nginx.zip"
  }

  if (-not $nginxdir.EndsWith('\')) {
    $nginxdir += '\'
  }

  if (-not (Test-Path $nginxdir)) {
    Expand-Archive -LiteralPath $nginxlink -DestinationPath $nginxdir -Force
    Move-Item "${nginxdir}\nginx\*" $nginxdir -Force
    Remove-Item "${nginxdir}\nginx" -Force
  }

  if (-not (Test-Path "${nginxdir}\conf\sites\${nginxconf}")) {
    New-Item -ItemType File -Path "${nginxdir}\conf\sites\${nginxconf}"
  }
  
  if ($cert -eq '' -or $key -eq '') {
    if ($secureport -eq 443 -and $port -eq 80) {
      if ($basedomain -ne '' -and $basepublic -ne '' -and $ipbaseaddr -ne '' -and $frontdomain -ne '') {
        Write-Output 'Creating nginx http configuration...'
        $upstream = "$basedomain"
        $server = "$ipbaseaddr"
        if ($basepublic.Contains("hs/employeeService")) {
          $location = "${basepublic}"
        }
        else {
          $location = "${basepublic}/hs/employeeService/"
        }
        
        $config = @"
upstream $upstream {
    server $server;
}

server {
    listen $port;
    
    server_name $frontdomain;
    
    location /data/ {
        proxy_pass_header Content-Type;
        proxy_pass $location;
        proxy_ssl_verify off;
    }
    
    location /api/ {
        proxy_pass_header Content-Type;
        proxy_pass $location;
        proxy_ssl_verify off;
    }
  
    location / {
        root $dir;
        try_files `$uri `$uri/ /index.html;
        index index.html;
    }
}
"@
        Set-Content -Path "${nginxdir}\conf\sites\${nginxconf}" -Value $config
        Write-Output 'Nginx configuration was created!'
      }
      else {
        Write-Output "Nginx http configuration wasn't created! You need to add flags -basedomain, -ipbaseaddr, -basepublic, -frontdomain to create it."
      }
    }
  }
  else {
    if ($basedomain -ne '' -and $basepublic -ne '' -and $ipbaseaddr -ne '' -and $frontdomain -ne '') {
      Write-Output 'Creating nginx https configuration...'
      $upstream = "$basedomain"
      $server = "$ipbaseaddr"
      if ($basepublic.Contains("hs/employeeService")) {
        $location = "${basepublic}"
      }
      else {
        $location = "${basepublic}/hs/employeeService/"
      }

      $config = @"
upstream $upstream {
    server ${server}:${secureport};
}

server {
    listen $port;

    server_name $frontdomain;

    return 301 https://`$host`$request_uri;
}

server {
    listen $secureport ssl;

    server_name $frontdomain;

    ssl_certificate $cert;
    ssl_certificate_key $key;
    
    location /data/ {
        proxy_pass_header Content-Type;
        proxy_pass $location;
    }

    location /api/ {
        proxy_pass_header Content-Type;
        proxy_pass $location;
    }
  
    location / {
        root $dir;
        try_files `$uri `$uri/ /index.html;
        index index.html;
    }
}
"@
      Set-Content -Path "${nginxdir}\conf\sites\${nginxconf}" -Value $config
      Write-Output 'Nginx configuration was created!'
    }
    else {
      Write-Output "Nginx https configuration wasn't created! You need to add flags -basedomain, -ipbaseaddr, -basepublic, -frontdomain, -cert, -key to create it."
    }
  }

  Start-Process -FilePath "${nginxdir}\nginx.exe"
  Write-Output 'Nginx was started successfully!'
} else {
  Write-Output 'Nginx params does not set. Skip nginx installation'
}

if ($link -like "http*") {
  Write-Output 'Downloading files...'
  Invoke-WebRequest -OutFile "lk-zup.zip" $link
  $link = "lk-zup.zip"
}

if (-not $dir.EndsWith('\')) {
  $backupdir = $dir + '_backup\'
  $dir += '\'
}
else {
  $unslasheddir = $dir.Substring(0, $dir.Length - 1)
  $backupdir = $unslasheddir + '_backup\'
}

Write-Output 'Replacing old directory to the new one...'
if (Test-Path $dir) {
  Write-Output 'Creating backup directory...'
  if (Test-Path $backupdir) {
    Remove-Item $backupdir -Recurse -Force
  }
  Move-Item $dir $backupdir -Force
}

if (-not (Test-Path $dir)) {
  New-Item -ItemType Directory -Path $dir
}

Expand-Archive -LiteralPath $link -DestinationPath $dir -Force

Write-Output 'Files were replaced successfully!'

Exit 0
