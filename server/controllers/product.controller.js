import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import mongoose from 'mongoose';
export const createProductController = async (request, response) => {
    try {
        const { userId, name, image, category, subCategory, unit, stock, price, discount, description, more_details, isBiddable, startingBid, bidEndTime } = request.body;

        // Check for user existence
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            return response.status(404).json({ message: 'User not found', error: true });
        }

        // Check for required fields
        if (!userId || !name || !image || image.length === 0 || !category || category.length === 0 || !subCategory || subCategory.length === 0 || !unit || !price || !description) {
            return response.status(400).json({
                message: "Please fill all required fields",
                error: true,
                success: false
            });
        }

        // Validate bidding fields if bidding is enabled
        if (isBiddable) {
            if (!startingBid || startingBid <= 0) {
                return response.status(400).json({
                    message: "Starting bid amount must be greater than 0",
                    error: true,
                    success: false
                });
            }
            if (!bidEndTime) {
                return response.status(400).json({
                    message: "Bid end time is required when bidding is enabled",
                    error: true,
                    success: false
                });
            }
            // Validate bid end time is in the future
            const endTime = new Date(bidEndTime);
            if (endTime <= new Date()) {
                return response.status(400).json({
                    message: "Bid end time must be in the future",
                    error: true,
                    success: false
                });
            }
        }

        // Create the product
        const product = new ProductModel({
            userId,
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            isBiddable,
            startingBid: isBiddable ? startingBid : null,
            bidEndTime: isBiddable ? bidEndTime : null,
            bidStatus: isBiddable ? 'active' : 'not_started',
            currentBid: isBiddable ? startingBid : null
        });

        // Save the product to the database
        const savedProduct = await product.save();

        return response.json({
            message: "Product Created Successfully",
            data: savedProduct,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error creating product:", error);
        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            error: true,
            success: false
        });
    }
};

    


export const getProductController = async(request, response) => {
    try {

        let { page, limit, search } = request.body

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async(request, response) => {
    try {
        const { id } = request.body

        if (!id) {
            return response.status(400).json({
                message: "provide category id",
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: { $in: id }
        }).limit(15)

        return response.json({
            message: "category product list",
            data: product,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategoryAndSubCategory = async(request, response) => {
    try {
        const { categoryId, subCategoryId, page, limit } = request.body

        if (!categoryId || !subCategoryId) {
            return response.status(400).json({
                message: "Provide categoryId and subCategoryId",
                error: true,
                success: false
            })
        }

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        const query = {
            category: { $in: categoryId },
            subCategory: { $in: subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: "Product list",
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductDetails = async(request, response) => {
    try {
        const { productId } = request.body

        if (!productId) {
            return response.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        // Validate if productId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return response.status(400).json({
                message: "Invalid product ID format",
                error: true,
                success: false
            });
        }

        const product = await ProductModel.findOne({ _id: productId })
            .populate('category')
            .populate('subCategory')
            .populate('userId', 'name email');

        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Product details retrieved successfully",
            data: product,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error in getProductDetails:", error);
        return response.status(500).json({
            message: "An error occurred while retrieving product details",
            error: true,
            success: false,
            details: error.message
        });
    }
}

//update product
export const updateProductDetails = async(request, response) => {
    try {
        const { _id, isBiddable, startingBid, bidEndTime } = request.body

        if (!_id) {
            return response.status(400).json({
                message: "provide product _id",
                error: true,
                success: false
            })
        }

        // Validate bidding fields if bidding is enabled
        if (isBiddable) {
            if (!startingBid || startingBid <= 0) {
                return response.status(400).json({
                    message: "Starting bid amount must be greater than 0",
                    error: true,
                    success: false
                })
            }
            if (!bidEndTime) {
                return response.status(400).json({
                    message: "Bid end time is required when bidding is enabled",
                    error: true,
                    success: false
                })
            }
            // Validate bid end time is in the future
            const endTime = new Date(bidEndTime)
            if (endTime <= new Date()) {
                return response.status(400).json({
                    message: "Bid end time must be in the future",
                    error: true,
                    success: false
                })
            }
        }

        const product = await ProductModel.findByIdAndUpdate(
            _id,
            {
                ...request.body,
                currentBid: isBiddable ? startingBid : undefined,
                bidStatus: isBiddable ? 'active' : 'not_started'
            },
            { new: true }
        )

        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Product updated successfully",
            data: product,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete product
export const deleteProductDetails = async(request, response) => {
    try {
        const { _id } = request.body

        if (!_id) {
            return response.status(400).json({
                message: "provide _id ",
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({ _id: _id })

        return response.json({
            message: "Delete successfully",
            error: false,
            success: true,
            data: deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//search product
export const searchProduct = async(request, response) => {
    try {
        console.log("Search request body:", request.body);
        let { search, page, limit } = request.body;

        page = Number(page) || 1;
        limit = Number(limit) || 10;

        let query = {};
        if (search && search.trim()) {
            query = {
                name: { $regex: search, $options: 'i' }
            };
        }

        console.log("Search query:", query);
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category')
                .populate('subCategory'),
            ProductModel.countDocuments(query)
        ]);

        console.log(`Found ${data.length} products out of ${totalCount} total`);

        return response.json({
            message: "Search results retrieved successfully",
            error: false,
            success: true,
            data,
            totalCount,
            totalPage: Math.ceil(totalCount / limit),
            page,
            limit
        });
    } catch (error) {
        console.error("Search error:", error);
        return response.status(500).json({
            message: "An error occurred while searching products",
            error: true,
            success: false,
            details: error.message
        });
    }
};

//specific userid  add products
export const getProductsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate if userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid userId format",
                error: true,
                success: false
            });
        }

        // Fetch products associated with the userId
        const products = await ProductModel.find({ userId })
            .populate('category')       // Populate category details
            .populate('subCategory')    // Populate sub-category details
            .lean();                    // Optimize performance by converting to plain JavaScript object

        return res.status(200).json({
            message: products.length ? "Products retrieved successfully" : "No products found",
            error: false,
            success: true,
            data: products
        });

    } catch (error) {
        console.error("Error in getProductsByUserId:", error); // Log error to the console
        return res.status(500).json({
            message: "An error occurred while retrieving products",
            error: true,
            success: false,
            details: error.message
        });
    }
}