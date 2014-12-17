package DAO;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import DataObjects.*;

public class ProductsDAO implements IProductDAO {
	private DataSource dataSource;
	 
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}
	@Override
	public List<Product> GetAllProducts() {
		Connection conn = null; 
		try {
			conn = dataSource.getConnection();
			JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
			List<Product> results = jdbcTemplate.query(
	                "select * from Products", new Object[0],
	                new RowMapper<Product>() {
	                    @Override
	                    public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
	                        return new Product(rs.getLong("id"), rs.getString("name"), rs.getDouble("price"), rs.getString("description"));
	                    }
	                });
			
			return results;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}
	}
}
