package DataObjects;

public class Product {
    private long id;
    private String name, image, description;
    private double price;
    
    public long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getImage() {
		return image;
	}

	public String getDescription() {
		return description;
	}

	public double getPrice() {
		return price;
	}	
   
    public Product() {
    }
    
    public Product(long id, String name, double price, String description) {
    	this.id = id;
    	this.name = name;
    	this.price = price;
    	this.description = description;
    }
    
    public Product(long id, String name, String image, String description, double price) {
    	this.id = id;
    	this.name = name;
    	this.image = image;
    	this.description = description;
    	this.price = price;
    }
    
    @Override
    public String toString() {
        return String.format(
                "Product[id=%d, name='%s', price='%f']",
                id, name, price);
    }
}
