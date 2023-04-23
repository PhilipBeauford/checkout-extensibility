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
  
  // Set up some static product variants that could be on offer
  // You'll need to change these to the appropriate values for your store
  // Your product variant data could come from an external HTTP call using `fetch()`
  const PRODUCT_VARIANTS_DATA = [
	{
	  id: "gid://shopify/ProductVariant/0000000000001",
	  img: "https://via.placeholder.com/100/F1F1F1?text=P1",
	  title: "Product 1 Title",
	  price: 10.0,
	},
	{
	  id: "gid://shopify/ProductVariant/0000000000002",
	  img: "https://via.placeholder.com/100/F1F1F1?text=P2",
	  title: "Product 2 Title",
	  price: 20.0,
	},
  ];
  
  // Set up the entry point for the extension
  extend(
	"Checkout::Dynamic::Render",
	(root, { lines, applyCartLinesChange, i18n }) => {
	  // Set up the states
	  let products = [];
	  let loading = true;
	  let appRendered = false;
  
	  // On initial load, fetch the product variants
	  // If you're making a network request, then replace the following code with the HTTP call
	  // If you don't need to make a network request, then you can call `renderApp()`
	  new Promise((resolve) => {
		setTimeout(() => {
		  resolve(PRODUCT_VARIANTS_DATA);
		}, 800);
	  })
		.then((result) => {
		  // Set the product variants
		  products = result;
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
		root.createComponent(Heading, {}, "You may also like"),
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
  
		// Filter out any product variants on offer that are already current cart lines
		const productsOnOffer = products.filter(
		  (product) =>
			!lines.current
			  .map((item) => item.merchandise.id)
			  .includes(product.id)
		);
		// Choose the first available product variant on offer or display the default fallback product
		const { id, img, title, price } = productsOnOffer[0] || products[0];
  
		// Localize the currency for international merchants and customers
		const renderPrice = i18n.formatCurrency(price);
  
		// Bind data to the components
		imageComponent.updateProps({ source: img });
		titleMarkup.updateText(title);
		addButtonComponent.updateProps({
		  accessibilityLabel: `Add ${title} to cart`,
		});
		priceMarkup.updateText(renderPrice);
		merchandise.id = id;
  
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