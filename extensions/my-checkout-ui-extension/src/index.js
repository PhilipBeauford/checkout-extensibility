import {
	extend,
	Text,
	InlineLayout,
	BlockStack,
	Divider,
	Image,
	Banner,
	Heading,
	Button,
	SkeletonImage,
	SkeletonText,
  } from "@shopify/checkout-ui-extensions";
  
  // Set up the entry point for the extension
  extend(
	"Checkout::Dynamic::Render",
	(root, { lines, applyCartLinesChange, query, i18n }) => {
	  // Set up the states
	  let products = [];
	  let loading = true;
	  let appRendered = false;
  
	  // Use the `query` API method to send graphql queries to the Storefront API
	  query(
		`query ($first: Int!) {
		  products(first: $first) {
			nodes {
			  id
			  title
			  images(first:1){
				nodes {
				  url
				}
			  }
			  variants(first: 1) {
				nodes {
				  id
				  price {
					amount
				  }
				}
			  }
			}
		  }
		},
		{
		  variables: {first: 5},
		},`
	  )
		.then(({data}) => {
		  // Set the product variants
		  products = data.products.nodes;
		})
		.catch((err) => console.error(err))
		.finally(() => {
		  loading = false;
		  // Call the `renderApp()` helper to filter, data-bind, and render the products on offer
		  renderApp();
		});
  
	  // Manually subscribe to changes to cart lines. This calls the `renderApp` helper function when the cart lines have changed
	  lines.subscribe(() => renderApp());
  
	  // Show a loading UI if you're waiting for product variant data
	  // Use Skeleton components to keep placement from shifting when content loads
	  const loadingState = root.createComponent(
		BlockStack,
		{ spacing: "loose" },
		[
		  root.createComponent(Divider),
		  root.createComponent(Heading, { level: 2 }, ["You might also like"]),
		  root.createComponent(BlockStack, { spacing: "loose" }, [
			root.createComponent(
			  InlineLayout,
			  {
				spacing: "base",
				columns: [64, "fill", "auto"],
				blockAlignment: "center",
			  },
			  [
				root.createComponent(SkeletonImage, { aspectRatio: 1 }),
				root.createComponent(BlockStack, { spacing: "none" }, [
				  root.createComponent(SkeletonText, { inlineSize: "large" }),
				  root.createComponent(SkeletonText, { inlineSize: "small" }),
				]),
				root.createComponent(
				  Button,
				  { kind: "secondary", disabled: true },
				  [root.createText("Add")]
				),
			  ]
			),
		  ]),
		]
	  );
  
	  // Render the loading state
	  if (loading) {
		root.appendChild(loadingState);
	  }
  
	  // Initialize the components to render for the product offer
	  // You'll need to manually bind data to them, this happens within the `renderApp` helper
	  const imageComponent = root.createComponent(Image, {
		border: "base",
		borderWidth: "base",
		borderRadius: "loose",
		aspectRatio: 1,
		source: "",
	  });
	  const titleMarkup = root.createText("");
	  const priceMarkup = root.createText("");
	  const merchandise = { id: "" };
  
	  // Defines the "Add" Button component used in the app
	  const addButtonComponent = root.createComponent(
		Button,
		{
		  kind: "secondary",
		  loading: false,
		  onPress: async () => {
			addButtonComponent.updateProps({ loading: true });
  
			// Apply the cart lines change
			const result = await applyCartLinesChange({
			  type: "addCartLine",
			  merchandiseId: merchandise.id,
			  quantity: 1,
			});
  
			addButtonComponent.updateProps({ loading: false });
  
			if (result.type === "error") {
			  // An error occurred adding the cart line
			  // Verify that you're using a valid product variant ID
			  // For example, 'gid://shopify/ProductVariant/123'
			  console.error(result.message);
			  const errorComponent = root.createComponent(
				Banner,
				{ status: "critical" },
				["There was an issue adding this product. Please try again."]
			  );
			  // Render an error Banner as a child of the top-level app component for three seconds, then remove it
			  const topLevelComponent = root.children[0];
			  topLevelComponent.appendChild(errorComponent);
			  setTimeout(
				() => topLevelComponent.removeChild(errorComponent),
				3000
			  );
			}
		  },
		},
		["Add"]
	  );
  
	  // Defines the main app responsible for rendering a product offer
	  const app = root.createComponent(BlockStack, { spacing: "loose" }, [
		root.createComponent(Divider),
		root.createComponent(Heading, { level: 2 }, "You might also like"),
		root.createComponent(BlockStack, { spacing: "loose" }, [
		  root.createComponent(
			InlineLayout,
			{
			  spacing: "base",
			  // Use the `columns` property to set the width of the columns
			  // Image: column should be 64px wide
			  // BlockStack: column, which contains the title and price, should "fill" all available space
			  // Button: column should "auto" size based on the intrinsic width of the elements
			  columns: [64, "fill", "auto"],
			  blockAlignment: "center",
			},
			[
			  imageComponent,
			  root.createComponent(BlockStack, { spacing: "none" }, [
				root.createComponent(
				  Text,
				  { size: "medium", emphasis: "strong" },
				  [titleMarkup]
				),
				root.createComponent(Text, { appearance: "subdued" }, [
				  priceMarkup,
				]),
			  ]),
			  addButtonComponent,
			]
		  ),
		]),
	  ]);
  
	  // This function will be called once the product variants are initially loaded or the cart lines have changed
	  function renderApp() {
		if (loading) {
		  // If still loading, then do nothing
		  return;
		}
  
		if (!loading && products.length === 0) {
		  // If loading is complete, but there are no product variants, then remove the loading state and don't render anything
		  root.removeChild(loadingState);
		  return;
		}
  
		// Get the IDs of all product variants in the cart
		const cartLineProductVariantIds = lines.current.map((item) => item.merchandise.id);
		// Filter out any products on offer that are already in the cart
		const productsOnOffer = products.filter(
		  (product) => {
			const isProductVariantInCart = product.variants.nodes.some(
			  ({id}) => cartLineProductVariantIds.includes(id)
			);
			return !isProductVariantInCart;
		  }
		);
  
		if (!loading && productsOnOffer.length === 0) {
		  // If loading is complete, but all available products are already in the cart, then remove the loading state and
		  // don't render anything
		  if (loadingState.parent) root.removeChild(loadingState);
		  return;
		}
  
		// Choose the first available product variant on offer
		const { images, title, variants } = productsOnOffer[0];
  
		// Localize the currency for international merchants and customers
		const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);
  
		const imageUrl = images.nodes[0]?.url
		  ?? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081";
  
		// Bind data to the components
		imageComponent.updateProps({ source: imageUrl });
		titleMarkup.updateText(title);
		addButtonComponent.updateProps({
		  accessibilityLabel: `Add ${title} to cart`,
		});
		priceMarkup.updateText(renderPrice);
		merchandise.id = variants.nodes[0].id;
  
		// Prevent against unnecessary re-renders
		if (!appRendered) {
		  // Remove the loading state
		  root.removeChild(loadingState);
		  // Render the product offer app with the product data
		  root.appendChild(app);
		  appRendered = true;
		}
	  }
	}
  );
  