<?php

/*This class stores information about products in the database.*/

class Warehouse
{
    private const Products = array('Dvd' => 'Dvd', 'Book' => 'Book', 'Furniture' => 'Furniture');

    /*Public getter to get private variable of the Warehouse class (Products array).*/
    public function getProducts(): array
    {
        return self::Products;
    }

    public function getClassName(string $productName): string
    {
        return self::Products[$productName];
    }
}