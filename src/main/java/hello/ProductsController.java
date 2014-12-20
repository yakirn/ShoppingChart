package hello;

import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import DAO.ProductsDAO;
import DataObjects.Product;

@Controller
public class ProductsController {
    
    @RequestMapping("/products")
    public @ResponseBody List<Product> Products(Model model){
    	ApplicationContext context = 
        		new ClassPathXmlApplicationContext("Spring-Module.xml");
     
    	ProductsDAO customerDAO = (ProductsDAO) context.getBean("productDAO");         
     
        List<Product> products = customerDAO.GetAllProducts();
        return products;
    }

}
