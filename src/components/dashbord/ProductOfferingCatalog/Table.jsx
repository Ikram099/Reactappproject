import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Popconfirm, Empty } from 'antd';
import { getall, deleteCatalog } from '../../../features/servicenow/product-offering/productOfferingCatalogSlice';

function Table({setData , setOpen, dispatch}) {
    
    const { data: products, loading, error } = useSelector((state) => state.productOfferingCatalog);

    useEffect(() => {
        dispatch(getall());
    }, [dispatch]);

    const handleDelete = async (productId) => {
        await dispatch(deleteCatalog(productId));
        await dispatch(getall());
    };

    function changeData(newData) {
        setData(newData)
        setOpen(true)
      }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="overflow-x-auto rounded border border-gray-300 w-9/12 shadow-2xl">
            <table className="min-w-full divide-y-2 divide-gray-200">
                <thead className="ltr:text-left rtl:text-right bg-cyan-700 text-white">
                    <tr className="*:font-medium ">
                        <th className="px-3 py-3 whitespace-nowrap">Number</th>
                        <th className="px-3 py-3 whitespace-nowrap">Name</th>
                        <th className="px-3 py-3 whitespace-nowrap">Status</th>
                        <th className="px-3 py-3 whitespace-nowrap">Start Date</th>
                        <th className="px-3 py-3 whitespace-nowrap">End Date</th>
                        <th className="px-3 py-3 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {products?.map((product) => (
                        <tr key={product.number} className="*:text-gray-900 *:first:font-medium">
                            <td className="px-3 py-3 whitespace-nowrap">{product.number}</td>
                            <td className="px-3 py-3 whitespace-nowrap">{product.name}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs capitalize rounded ${product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {product.status}
                                </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">{product.start_date || 'N/A'}</td>
                            <td className="px-3 py-3 whitespace-nowrap">{product.end_date || 'N/A'}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                                <button
                                    className="mr-2 text-gray-500 hover:text-blue-600 "
                                    onClick={() => changeData(product)}
                                >
                                    <i className="ri-pencil-line text-2xl"></i>
                                </button>


                                <Popconfirm
                                    title="Delete the catalog"
                                    description="Are you sure to delete this catalog?"
                                    icon={<i className="ri-error-warning-line text-red-600 mr-2"></i>}
                                    onConfirm={() => handleDelete(product.sys_id)}
                                >
                                    <button
                                        className="text-gray-500 hover:text-red-600 "
                                    >
                                        <i className="ri-delete-bin-6-line text-2xl"></i>
                                    </button>
                                </Popconfirm>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;