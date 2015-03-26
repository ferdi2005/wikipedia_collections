# Make cache clearable by everyone in www-data group
# First make sure that new files in every dir are created with www-data group
find . -type d -exec sudo chmod g+s {} \;

echo "Now put 'umask 002' at the bottom of /etc/apache2/envvars to make sure apache2 creates files with 775 permissions "
