cd /root;
nohup redis-server >> /dev/null &
mkdir -p /data/db;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:app &
echo ;
sleep 2;
echo ;
python app.py
