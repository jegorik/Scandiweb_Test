<?php
/*Class to implement OOP logic, like inheritance.*/

class Product
{
    protected string $sku;
    protected string $name;
    protected string $price;
    protected string $type;
    protected string $attribute;

    public function getSku(): string
    {
        return $this->sku;
    }


    public function setSku(string $sku): void
    {
        $this->sku = $sku;
    }


    public function getName(): string
    {
        return $this->name;
    }


    public function setName(string $name): void
    {
        $this->name = $name;
    }


    public function getPrice(): string
    {
        return $this->price;
    }


    public function setPrice(string $price): void
    {
        $this->price = $price;
    }


    public function getType(): string
    {
        return $this->type;
    }


    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function getAttribute(): string
    {
        return $this->attribute;
    }


    public function setAttribute(string $attribute): void
    {
        $this->attribute = $attribute;
    }

}
