import mongoose from 'mongoose';

const ProductSpecificationSchema = new mongoose.Schema({
  sys_id: String,
  display_name: String,
  specification_category: String,
  specification_type: String,
  start_date: String,
  description: String,
  status: String,
  cost_to_company: String,
}, { timestamps: true });

const ProductSpecification = mongoose.model('ProductSpecification', ProductSpecificationSchema, 'product_specifications');

export default ProductSpecification;
