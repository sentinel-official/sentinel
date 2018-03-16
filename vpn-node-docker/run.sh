ACCOUNT_DATA=/root/.sentinel/account.data
if [ -f "$ACCOUNT_DATA" ]; then
    echo "$ACCOUNT_DATA found."
else
    echo -n "$ACCOUNT_DATA not found. Please enter password for creating new account: "
    read PASSWORD

cd /root;
nohup redis-server >> /dev/null &
mkdir -p /data/db;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:app &
echo ;
sleep 2;
echo ;
python app.py $PASSWORD
