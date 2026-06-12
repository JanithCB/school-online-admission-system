import pymysql

try:
    connection = pymysql.connect(host='localhost', user='root', password='')
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS school_admission;")
    print("Database created or already exists.")
    connection.close()
except Exception as e:
    print(f"Error creating database: {e}")
