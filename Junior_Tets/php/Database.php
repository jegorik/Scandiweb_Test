<?php

/*This class contains variables and functions used to operate with database. */

class Database
{
    /*Database information.*/
    private string $host = '127.0.0.1:3306';
    private string $user = 'root';
    private string $password = '78Th12QmLT!dRt51';
    private string $databaseName = 'products';
    private PDO $connectStatus;

    /*This function tries to make connection with a database.*/
    public function connection(): PDO
    {
        /*Checking if connection exist.*/
        if (!isset($this->connectStatus)) {
            try {
                /*Trying to connect to a database using PDO.*/
                $this->connectStatus = new PDO(
                    'mysql:host=' . $this->host . ';dbname=' . $this->databaseName,
                    $this->user,
                    $this->password
                );
            } catch (PDOException $pe) {
                die('Could not connect to the database: ' . $pe->getMessage());
            }
        }
        /*Return connection data.*/
        return $this->connectStatus;
    }


    /*This function saves form data to a database.*/
    public function doSave(object $product): array
    {
        /*Run connection procedure.*/
        $connection = $this->connection();
        /*Prepare save query.*/
        $sql = 'INSERT INTO products (sku, name, price, type, attribute) VALUES (:sku,:name, :price, :type,:attribute)';
        $stmt = $connection->prepare($sql);
        /*Try to make data save. Send result as array to callback function.*/
        try {
            $stmt->execute(
                [
                    'sku' => $product->getSku(),
                    'name' => $product->getName(),
                    'price' => $product->getPrice(),
                    'type' => $product->getType(),
                    'attribute' => $product->getAttribute()
                ]
            );
            return ['success' => 'Data saved.'];
        } catch (Exception $error) {
            return ['Unable to save data to a database: ' . $error->getMessage()];
        }
    }
/*This function creates lod query for product data and returns result as array.*/
    public function loadData(): array
    {
        $connection = $this->connection();
        return $connection->query('SELECT * FROM products')->fetchAll();
    }
/*This function receives array with product sku. Then it creates delete query and return string result.*/
    public function deleteData($formData): string
    {
        $connection = $this->connection();

        foreach ($formData as $sku) {
            $sql = 'DELETE FROM products  WHERE sku= :sku';
            $stmt = $connection->prepare($sql);
            $stmt->bindParam(':sku', $sku);
            $stmt->execute();
        }
        return 'deleted';
    }
}