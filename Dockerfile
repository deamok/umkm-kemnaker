# Gunakan Nginx versi ringan
FROM nginx:alpine

# Menyalin konfigurasi custom Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Menghapus file default nginx
RUN rm -rf /usr/share/nginx/html/*

# Menyalin seluruh file website statis ke dalam folder publik Nginx
COPY . /usr/share/nginx/html/

# Mengekspos port 80 untuk lalu lintas HTTP
EXPOSE 80

# Menjalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
