<?php
/**
 * Title: Top Sell Section
 * Slug: salecraft-ecommerce/top-sell-section
 * Categories: salecraft-ecommerce
 *
 * @package SaleCraft Ecommerce
 * @since 1.0.0
 */

$salecraft_ecommerce_v2_pluginsList = get_option( 'active_plugins' );
$salecraft_ecommerce_v2_plugin = 'woocommerce/woocommerce.php';
$salecraft_ecommerce_v2_results = in_array( $salecraft_ecommerce_v2_plugin , $salecraft_ecommerce_v2_pluginsList);
if ( $salecraft_ecommerce_v2_results )  {
?>

<!-- wp:group {"metadata":{"patternName":"salecraft-ecommerce/top-sell-section","name":"Top Sell Section","categories":["salecraft-ecommerce"]},"className":"top-sell-section","style":{"spacing":{"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"constrained","contentSize":"85%"}} -->
<div class="wp-block-group top-sell-section" style="padding-right:0px;padding-left:0px"><!-- wp:columns {"className":"top-sell-boxes"} -->
<div class="wp-block-columns top-sell-boxes"><!-- wp:column {"width":"35%","className":"top-sell-cover"} -->
<div class="wp-block-column top-sell-cover" style="flex-basis:35%"><!-- wp:cover {"overlayColor":"primary-light","isUserOverlayColor":true,"isDark":false,"className":"top-sell-bg","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px","bottomLeft":"8px","bottomRight":"8px"}},"spacing":{"padding":{"top":"10px","bottom":"10px","left":"0px","right":"0px"}}},"layout":{"type":"constrained","contentSize":"85%"}} -->
<div class="wp-block-cover is-light top-sell-bg" style="border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-left-radius:8px;border-bottom-right-radius:8px;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:0px"><span aria-hidden="true" class="wp-block-cover__background has-primary-light-background-color has-background-dim-100 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:image {"id":7,"width":"auto","height":"140px","sizeSlug":"full","linkDestination":"none","className":"top-sell-img"} -->
<figure class="wp-block-image size-full is-resized top-sell-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/sale-cover-img.png" alt="" class="wp-image-7" style="width:auto;height:140px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"}}} -->
<p style="font-size:15px"><?php echo esc_html__( '20% Off', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"30px","textTransform":"capitalize","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"8px"}}},"textColor":"contrast"} -->
<h3 class="wp-block-heading has-contrast-color has-text-color has-link-color" style="margin-top:8px;font-size:30px;font-style:normal;font-weight:600;text-transform:capitalize"><?php echo esc_html__( 'premium audio deals', 'salecraft-ecommerce-v2' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px","textTransform":"capitalize","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"top":"8px"}}},"textColor":"contrast"} -->
<p class="has-contrast-color has-text-color has-link-color" style="margin-top:8px;font-size:13px;font-style:normal;font-weight:400;text-transform:capitalize"><?php echo esc_html__( 'power meets portability', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"65%","className":"product-section"} -->
<div class="wp-block-column product-section" style="flex-basis:65%"><!-- wp:group {"style":{"border":{"radius":{"topLeft":"4px","topRight":"4px","bottomLeft":"4px","bottomRight":"4px"}},"spacing":{"padding":{"top":"8px","bottom":"8px","left":"15px","right":"15px"}}},"backgroundColor":"primary","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group has-primary-background-color has-background" style="border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-left-radius:4px;border-bottom-right-radius:4px;padding-top:8px;padding-right:15px;padding-bottom:8px;padding-left:15px"><!-- wp:heading {"level":4,"style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"24px","textTransform":"capitalize","fontStyle":"normal","fontWeight":"600"}},"textColor":"base"} -->
<h4 class="wp-block-heading has-base-color has-text-color has-link-color" style="font-size:24px;font-style:normal;font-weight:600;text-transform:capitalize"><?php echo esc_html__( 'top selling', 'salecraft-ecommerce-v2' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:buttons {"className":"custom-controls"} -->
<div class="wp-block-buttons custom-controls"><!-- wp:button {"className":"owl-prev","style":{"spacing":{"padding":{"left":"2px","right":"2px","top":"2px","bottom":"2px"}},"color":{"background":"#00000000"}}} -->
<div class="wp-block-button owl-prev"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#00000000;padding-top:2px;padding-right:2px;padding-bottom:2px;padding-left:2px"><span class="dashicons dashicons-arrow-left-alt2"></span></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"owl-next","style":{"spacing":{"padding":{"left":"2px","right":"2px","top":"2px","bottom":"2px"}},"color":{"background":"#00000000"}}} -->
<div class="wp-block-button owl-next"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#00000000;padding-top:2px;padding-right:2px;padding-bottom:2px;padding-left:2px"><span class="dashicons dashicons-arrow-right-alt2"></span></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->

<!-- wp:woocommerce/product-collection {"queryId":5,"query":{"perPage":5,"pages":1,"offset":0,"postType":"product","order":"desc","orderBy":"date","search":"","exclude":[],"inherit":false,"taxQuery":[],"isProductCollectionBlock":true,"featured":false,"woocommerceOnSale":false,"woocommerceStockStatus":["instock","outofstock","onbackorder"],"woocommerceAttributes":[],"woocommerceHandPickedProducts":[],"timeFrame":{"operator":"in","value":"-7 days"},"filterable":false,"relatedBy":{"categories":true,"tags":true}},"tagName":"div","displayLayout":{"type":"flex","columns":3,"shrinkColumns":true},"dimensions":{"widthType":"fill"},"collection":"woocommerce/product-collection/new-arrivals","hideControls":["inherit","order","filterable"],"queryContextIncludes":["collection"],"__privatePreviewState":{"isPreview":false,"previewMessage":"Actual products will vary depending on the page being viewed."},"className":"product-boxes"} -->
<div class="wp-block-woocommerce-product-collection product-boxes"><!-- wp:woocommerce/product-template -->
<!-- wp:group {"className":"product-cards wow zoomIn","style":{"spacing":{"padding":{"top":"12px","bottom":"12px","left":"12px","right":"12px"}},"border":{"radius":"10px"}},"backgroundColor":"section-background","layout":{"type":"default"}} -->
<div class="wp-block-group product-cards wow zoomIn has-section-background-background-color has-background" style="border-radius:10px;padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px"><!-- wp:group {"className":"product-img-box","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group product-img-box has-base-background-color has-background" style="border-radius:10px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:woocommerce/product-image {"showSaleBadge":false,"imageSizing":"thumbnail","isDescendentOfQueryLoop":true,"height":"150px","className":"product-img"} /-->

<!-- wp:post-terms {"term":"product_cat","className":"product-left-text","style":{"spacing":{"margin":{"top":"0px"},"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"}},"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"border":{"radius":{"topLeft":"10px","bottomRight":"6px"}},"typography":{"fontSize":"14px"}},"backgroundColor":"primary","textColor":"base"} /-->

<!-- wp:group {"className":"product-right-box","style":{"spacing":{"margin":{"top":"0px"},"blockGap":"6px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group product-right-box" style="margin-top:0px"><!-- wp:post-terms {"term":"product_tag","className":"product-right-text","style":{"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px","bottom":"6px"}},"typography":{"fontSize":"14px"},"color":{"background":"#ff2929"},"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"border":{"radius":{"topRight":"10px","bottomLeft":"6px"}}},"textColor":"base"} /-->

<!-- wp:woocommerce/product-button {"textAlign":"center","isDescendentOfQueryLoop":true,"className":"product-cart-btn","fontSize":"small","style":{"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"}}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"product-content","layout":{"type":"default"}} -->
<div class="wp-block-group product-content"><!-- wp:post-title {"textAlign":"left","isLink":true,"className":"product-card-title","style":{"spacing":{"margin":{"bottom":"5px","top":"0"}},"typography":{"lineHeight":"1.4","fontSize":"18px","fontStyle":"normal","fontWeight":"600"}},"__woocommerceNamespace":"woocommerce/product-collection/product-title"} /-->

<!-- wp:woocommerce/product-summary {"isDescendentOfQueryLoop":true,"showDescriptionIfEmpty":true,"summaryLength":15,"textColor":"contrast","className":"product-card-desc","style":{"typography":{"fontSize":"13px"},"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} /-->

<!-- wp:group {"className":"product-btm-box","style":{"spacing":{"margin":{"top":"8px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group product-btm-box" style="margin-top:8px"><!-- wp:woocommerce/product-price {"isDescendentOfQueryLoop":true,"textAlign":"center","style":{"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"700"}}} /-->

<!-- wp:woocommerce/product-rating {"isDescendentOfQueryLoop":true} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:woocommerce/product-template --></div>
<!-- /wp:woocommerce/product-collection --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:spacer {"height":"35px"} -->
<div style="height:35px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->

<?php } else { ?>

<!-- wp:group {"className":"top-sell-section","style":{"spacing":{"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"constrained","contentSize":"85%"}} -->
<div class="wp-block-group top-sell-section" style="padding-right:0px;padding-left:0px"><!-- wp:columns {"className":"top-sell-boxes"} -->
<div class="wp-block-columns top-sell-boxes"><!-- wp:column {"width":"35%","className":"top-sell-cover"} -->
<div class="wp-block-column top-sell-cover" style="flex-basis:35%"><!-- wp:cover {"overlayColor":"primary-light","isUserOverlayColor":true,"isDark":false,"className":"top-sell-bg","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px","bottomLeft":"8px","bottomRight":"8px"}},"spacing":{"padding":{"top":"10px","bottom":"10px","left":"0px","right":"0px"}}},"layout":{"type":"constrained","contentSize":"85%"}} -->
<div class="wp-block-cover is-light top-sell-bg" style="border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-left-radius:8px;border-bottom-right-radius:8px;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:0px"><span aria-hidden="true" class="wp-block-cover__background has-primary-light-background-color has-background-dim-100 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:image {"id":7,"width":"auto","height":"140px","sizeSlug":"full","linkDestination":"none","className":"top-sell-img"} -->
<figure class="wp-block-image size-full is-resized top-sell-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/sale-cover-img.png" alt="" class="wp-image-7" style="width:auto;height:140px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"}}} -->
<p style="font-size:15px"><?php echo esc_html__( '20% Off', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"30px","textTransform":"capitalize","fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"8px"}}},"textColor":"contrast"} -->
<h3 class="wp-block-heading has-contrast-color has-text-color has-link-color" style="margin-top:8px;font-size:30px;font-style:normal;font-weight:600;text-transform:capitalize"><?php echo esc_html__( 'premium audio deals', 'salecraft-ecommerce-v2' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px","textTransform":"capitalize","fontStyle":"normal","fontWeight":"400"},"spacing":{"margin":{"top":"8px"}}},"textColor":"contrast"} -->
<p class="has-contrast-color has-text-color has-link-color" style="margin-top:8px;font-size:13px;font-style:normal;font-weight:400;text-transform:capitalize"><?php echo esc_html__( 'power meets portability', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"65%","className":"product-section"} -->
<div class="wp-block-column product-section" style="flex-basis:65%"><!-- wp:group {"style":{"border":{"radius":{"topLeft":"4px","topRight":"4px","bottomLeft":"4px","bottomRight":"4px"}},"spacing":{"padding":{"top":"8px","bottom":"8px","left":"15px","right":"15px"}}},"backgroundColor":"primary","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group has-primary-background-color has-background" style="border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-left-radius:4px;border-bottom-right-radius:4px;padding-top:8px;padding-right:15px;padding-bottom:8px;padding-left:15px"><!-- wp:heading {"level":4,"style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"24px","textTransform":"capitalize","fontStyle":"normal","fontWeight":"600"}},"textColor":"base"} -->
<h4 class="wp-block-heading has-base-color has-text-color has-link-color" style="font-size:24px;font-style:normal;font-weight:600;text-transform:capitalize"><?php echo esc_html__( 'top selling', 'salecraft-ecommerce-v2' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:buttons {"className":"custom-controls"} -->
<div class="wp-block-buttons custom-controls"><!-- wp:button {"className":"owl-prev","style":{"spacing":{"padding":{"left":"2px","right":"2px","top":"2px","bottom":"2px"}},"color":{"background":"#00000000"}}} -->
<div class="wp-block-button owl-prev"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#00000000;padding-top:2px;padding-right:2px;padding-bottom:2px;padding-left:2px"><span class="dashicons dashicons-arrow-left-alt2"></span></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"owl-next","style":{"spacing":{"padding":{"left":"2px","right":"2px","top":"2px","bottom":"2px"}},"color":{"background":"#00000000"}}} -->
<div class="wp-block-button owl-next"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#00000000;padding-top:2px;padding-right:2px;padding-bottom:2px;padding-left:2px"><span class="dashicons dashicons-arrow-right-alt2"></span></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->

<!-- wp:columns {"className":"product-boxes owl-carousel"} -->
<div class="wp-block-columns product-boxes owl-carousel"><!-- wp:column {"className":"product-cards wow zoomIn","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"12px","bottom":"12px","left":"12px","right":"12px"}}},"backgroundColor":"section-background"} -->
<div class="wp-block-column product-cards wow zoomIn has-section-background-background-color has-background" style="border-radius:10px;padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px"><!-- wp:group {"className":"product-img-box","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group product-img-box has-base-background-color has-background" style="border-radius:10px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:image {"id":79,"width":"auto","height":"150px","sizeSlug":"full","linkDestination":"none","align":"center","className":"product-img"} -->
<figure class="wp-block-image aligncenter size-full is-resized product-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/product6.png" alt="" class="wp-image-79" style="width:auto;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"product-left-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px"}},"border":{"radius":{"topLeft":"10px","bottomRight":"6px"}}},"backgroundColor":"primary","textColor":"base"} -->
<p class="product-left-text has-base-color has-primary-background-color has-text-color has-background has-link-color" style="border-top-left-radius:10px;border-bottom-right-radius:6px;margin-top:0px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'feature', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-right-box","style":{"spacing":{"margin":{"top":"0px"},"blockGap":"6px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group product-right-box" style="margin-top:0px"><!-- wp:paragraph {"className":"product-right-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px","bottom":"6px"}},"border":{"radius":{"topRight":"10px","bottomLeft":"6px"}},"color":{"background":"#ff2929"}},"textColor":"base"} -->
<p class="product-right-text has-base-color has-text-color has-background has-link-color" style="border-top-right-radius:10px;border-bottom-left-radius:6px;background-color:#ff2929;margin-top:0px;margin-bottom:6px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'new', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":169,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-wishlist-btn"} -->
<figure class="wp-block-image size-full is-resized product-wishlist-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/heart.png" alt="" class="wp-image-169" style="width:auto;height:16px"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":170,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-cart-btn"} -->
<figure class="wp-block-image size-full is-resized product-cart-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/cart.png" alt="" class="wp-image-170" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"product-content","layout":{"type":"default"}} -->
<div class="wp-block-group product-content"><!-- wp:heading {"level":6,"className":"product-card-title","style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","textTransform":"capitalize"}}} -->
<h6 class="wp-block-heading product-card-title" style="font-size:18px;font-style:normal;font-weight:500;text-transform:capitalize"><?php echo esc_html__( 'smart vacuum pro', 'salecraft-ecommerce-v2' ); ?></h6>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"product-card-desc","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px"},"spacing":{"margin":{"top":"5px"}}},"textColor":"contrast"} -->
<p class="product-card-desc has-contrast-color has-text-color has-link-color" style="margin-top:5px;font-size:13px"><?php echo esc_html__( 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-btm-box","style":{"spacing":{"margin":{"top":"5px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group product-btm-box" style="margin-top:5px"><!-- wp:group {"className":"product-price-box","style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group product-price-box"><!-- wp:paragraph {"className":"product-sale","style":{"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-sale" style="font-size:16px;font-style:normal;font-weight:600"><?php echo esc_html__( '$49.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"product-reg","style":{"typography":{"fontSize":"11px","textDecoration":"line-through","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-reg" style="font-size:11px;font-style:normal;font-weight:600;text-decoration:line-through"><?php echo esc_html__( '$59.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"id":150,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-card-rating"} -->
<figure class="wp-block-image size-full is-resized product-card-rating"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/rating.png" alt="" class="wp-image-150" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"product-cards wow zoomIn","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"12px","bottom":"12px","left":"12px","right":"12px"}}},"backgroundColor":"section-background"} -->
<div class="wp-block-column product-cards wow zoomIn has-section-background-background-color has-background" style="border-radius:10px;padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px"><!-- wp:group {"className":"product-img-box","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group product-img-box has-base-background-color has-background" style="border-radius:10px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:image {"id":80,"width":"auto","height":"150px","sizeSlug":"full","linkDestination":"none","align":"center","className":"product-img"} -->
<figure class="wp-block-image aligncenter size-full is-resized product-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/product7.png" alt="" class="wp-image-80" style="width:auto;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"product-left-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px"}},"border":{"radius":{"topLeft":"10px","bottomRight":"6px"}}},"backgroundColor":"primary","textColor":"base"} -->
<p class="product-left-text has-base-color has-primary-background-color has-text-color has-background has-link-color" style="border-top-left-radius:10px;border-bottom-right-radius:6px;margin-top:0px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'feature', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-right-box","style":{"spacing":{"margin":{"top":"0px"},"blockGap":"6px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group product-right-box" style="margin-top:0px"><!-- wp:paragraph {"className":"product-right-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px","bottom":"6px"}},"border":{"radius":{"topRight":"10px","bottomLeft":"6px"}},"color":{"background":"#ff2929"}},"textColor":"base"} -->
<p class="product-right-text has-base-color has-text-color has-background has-link-color" style="border-top-right-radius:10px;border-bottom-left-radius:6px;background-color:#ff2929;margin-top:0px;margin-bottom:6px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'new', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":169,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-wishlist-btn"} -->
<figure class="wp-block-image size-full is-resized product-wishlist-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/heart.png" alt="" class="wp-image-169" style="width:auto;height:16px"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":170,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-cart-btn"} -->
<figure class="wp-block-image size-full is-resized product-cart-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/cart.png" alt="" class="wp-image-170" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"product-content","layout":{"type":"default"}} -->
<div class="wp-block-group product-content"><!-- wp:heading {"level":6,"className":"product-card-title","style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","textTransform":"capitalize"}}} -->
<h6 class="wp-block-heading product-card-title" style="font-size:18px;font-style:normal;font-weight:500;text-transform:capitalize"><?php echo esc_html__( 'precision hair trimmer', 'salecraft-ecommerce-v2' ); ?></h6>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"product-card-desc","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px"},"spacing":{"margin":{"top":"5px"}}},"textColor":"contrast"} -->
<p class="product-card-desc has-contrast-color has-text-color has-link-color" style="margin-top:5px;font-size:13px"><?php echo esc_html__( 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-btm-box","style":{"spacing":{"margin":{"top":"5px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group product-btm-box" style="margin-top:5px"><!-- wp:group {"className":"product-price-box","style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group product-price-box"><!-- wp:paragraph {"className":"product-sale","style":{"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-sale" style="font-size:16px;font-style:normal;font-weight:600"><?php echo esc_html__( '$49.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"product-reg","style":{"typography":{"fontSize":"11px","textDecoration":"line-through","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-reg" style="font-size:11px;font-style:normal;font-weight:600;text-decoration:line-through"><?php echo esc_html__( '$59.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"id":150,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-card-rating"} -->
<figure class="wp-block-image size-full is-resized product-card-rating"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/rating.png" alt="" class="wp-image-150" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"product-cards wow zoomIn","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"12px","bottom":"12px","left":"12px","right":"12px"}}},"backgroundColor":"section-background"} -->
<div class="wp-block-column product-cards wow zoomIn has-section-background-background-color has-background" style="border-radius:10px;padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px"><!-- wp:group {"className":"product-img-box","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group product-img-box has-base-background-color has-background" style="border-radius:10px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:image {"id":81,"width":"auto","height":"150px","sizeSlug":"full","linkDestination":"none","align":"center","className":"product-img"} -->
<figure class="wp-block-image aligncenter size-full is-resized product-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/product8.png" alt="" class="wp-image-81" style="width:auto;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"product-left-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px"}},"border":{"radius":{"topLeft":"10px","bottomRight":"6px"}}},"backgroundColor":"primary","textColor":"base"} -->
<p class="product-left-text has-base-color has-primary-background-color has-text-color has-background has-link-color" style="border-top-left-radius:10px;border-bottom-right-radius:6px;margin-top:0px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'feature', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-right-box","style":{"spacing":{"margin":{"top":"0px"},"blockGap":"6px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group product-right-box" style="margin-top:0px"><!-- wp:paragraph {"className":"product-right-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px","bottom":"6px"}},"border":{"radius":{"topRight":"10px","bottomLeft":"6px"}},"color":{"background":"#ff2929"}},"textColor":"base"} -->
<p class="product-right-text has-base-color has-text-color has-background has-link-color" style="border-top-right-radius:10px;border-bottom-left-radius:6px;background-color:#ff2929;margin-top:0px;margin-bottom:6px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'new', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":169,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-wishlist-btn"} -->
<figure class="wp-block-image size-full is-resized product-wishlist-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/heart.png" alt="" class="wp-image-169" style="width:auto;height:16px"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":170,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-cart-btn"} -->
<figure class="wp-block-image size-full is-resized product-cart-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/cart.png" alt="" class="wp-image-170" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"product-content","layout":{"type":"default"}} -->
<div class="wp-block-group product-content"><!-- wp:heading {"level":6,"className":"product-card-title","style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","textTransform":"capitalize"}}} -->
<h6 class="wp-block-heading product-card-title" style="font-size:18px;font-style:normal;font-weight:500;text-transform:capitalize"><?php echo esc_html__( 'classic coffee maker', 'salecraft-ecommerce-v2' ); ?></h6>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"product-card-desc","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px"},"spacing":{"margin":{"top":"5px"}}},"textColor":"contrast"} -->
<p class="product-card-desc has-contrast-color has-text-color has-link-color" style="margin-top:5px;font-size:13px"><?php echo esc_html__( 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-btm-box","style":{"spacing":{"margin":{"top":"5px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group product-btm-box" style="margin-top:5px"><!-- wp:group {"className":"product-price-box","style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group product-price-box"><!-- wp:paragraph {"className":"product-sale","style":{"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-sale" style="font-size:16px;font-style:normal;font-weight:600"><?php echo esc_html__( '$49.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"product-reg","style":{"typography":{"fontSize":"11px","textDecoration":"line-through","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-reg" style="font-size:11px;font-style:normal;font-weight:600;text-decoration:line-through"><?php echo esc_html__( '$59.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"id":150,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-card-rating"} -->
<figure class="wp-block-image size-full is-resized product-card-rating"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/rating.png" alt="" class="wp-image-150" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"product-cards wow zoomIn","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"12px","bottom":"12px","left":"12px","right":"12px"}}},"backgroundColor":"section-background"} -->
<div class="wp-block-column product-cards wow zoomIn has-section-background-background-color has-background" style="border-radius:10px;padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px"><!-- wp:group {"className":"product-img-box","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group product-img-box has-base-background-color has-background" style="border-radius:10px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:image {"id":82,"width":"auto","height":"150px","sizeSlug":"full","linkDestination":"none","align":"center","className":"product-img"} -->
<figure class="wp-block-image aligncenter size-full is-resized product-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/product1.png" alt="" class="wp-image-82" style="width:auto;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"product-left-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px"}},"border":{"radius":{"topLeft":"10px","bottomRight":"6px"}}},"backgroundColor":"primary","textColor":"base"} -->
<p class="product-left-text has-base-color has-primary-background-color has-text-color has-background has-link-color" style="border-top-left-radius:10px;border-bottom-right-radius:6px;margin-top:0px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'feature', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-right-box","style":{"spacing":{"margin":{"top":"0px"},"blockGap":"6px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group product-right-box" style="margin-top:0px"><!-- wp:paragraph {"className":"product-right-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px","bottom":"6px"}},"border":{"radius":{"topRight":"10px","bottomLeft":"6px"}},"color":{"background":"#ff2929"}},"textColor":"base"} -->
<p class="product-right-text has-base-color has-text-color has-background has-link-color" style="border-top-right-radius:10px;border-bottom-left-radius:6px;background-color:#ff2929;margin-top:0px;margin-bottom:6px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'new', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":169,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-wishlist-btn"} -->
<figure class="wp-block-image size-full is-resized product-wishlist-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/heart.png" alt="" class="wp-image-169" style="width:auto;height:16px"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":170,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-cart-btn"} -->
<figure class="wp-block-image size-full is-resized product-cart-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/cart.png" alt="" class="wp-image-170" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"product-content","layout":{"type":"default"}} -->
<div class="wp-block-group product-content"><!-- wp:heading {"level":6,"className":"product-card-title","style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","textTransform":"capitalize"}}} -->
<h6 class="wp-block-heading product-card-title" style="font-size:18px;font-style:normal;font-weight:500;text-transform:capitalize"><?php echo esc_html__( 'smartphone x', 'salecraft-ecommerce-v2' ); ?></h6>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"product-card-desc","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px"},"spacing":{"margin":{"top":"5px"}}},"textColor":"contrast"} -->
<p class="product-card-desc has-contrast-color has-text-color has-link-color" style="margin-top:5px;font-size:13px"><?php echo esc_html__( 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-btm-box","style":{"spacing":{"margin":{"top":"5px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group product-btm-box" style="margin-top:5px"><!-- wp:group {"className":"product-price-box","style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group product-price-box"><!-- wp:paragraph {"className":"product-sale","style":{"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-sale" style="font-size:16px;font-style:normal;font-weight:600"><?php echo esc_html__( '$49.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"product-reg","style":{"typography":{"fontSize":"11px","textDecoration":"line-through","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-reg" style="font-size:11px;font-style:normal;font-weight:600;text-decoration:line-through"><?php echo esc_html__( '$59.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"id":150,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-card-rating"} -->
<figure class="wp-block-image size-full is-resized product-card-rating"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/rating.png" alt="" class="wp-image-150" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"product-cards wow zoomIn","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"12px","bottom":"12px","left":"12px","right":"12px"}}},"backgroundColor":"section-background"} -->
<div class="wp-block-column product-cards wow zoomIn has-section-background-background-color has-background" style="border-radius:10px;padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px"><!-- wp:group {"className":"product-img-box","style":{"border":{"radius":"10px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}}},"backgroundColor":"base","layout":{"type":"default"}} -->
<div class="wp-block-group product-img-box has-base-background-color has-background" style="border-radius:10px;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px"><!-- wp:image {"id":83,"width":"auto","height":"150px","sizeSlug":"full","linkDestination":"none","align":"center","className":"product-img"} -->
<figure class="wp-block-image aligncenter size-full is-resized product-img"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/product5.png" alt="" class="wp-image-83" style="width:auto;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"product-left-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px"}},"border":{"radius":{"topLeft":"10px","bottomRight":"6px"}}},"backgroundColor":"primary","textColor":"base"} -->
<p class="product-left-text has-base-color has-primary-background-color has-text-color has-background has-link-color" style="border-top-left-radius:10px;border-bottom-right-radius:6px;margin-top:0px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'feature', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-right-box","style":{"spacing":{"margin":{"top":"0px"},"blockGap":"6px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group product-right-box" style="margin-top:0px"><!-- wp:paragraph {"className":"product-right-text","style":{"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"14px","textTransform":"capitalize"},"spacing":{"padding":{"top":"3px","bottom":"3px","left":"10px","right":"10px"},"margin":{"top":"0px","bottom":"6px"}},"border":{"radius":{"topRight":"10px","bottomLeft":"6px"}},"color":{"background":"#ff2929"}},"textColor":"base"} -->
<p class="product-right-text has-base-color has-text-color has-background has-link-color" style="border-top-right-radius:10px;border-bottom-left-radius:6px;background-color:#ff2929;margin-top:0px;margin-bottom:6px;padding-top:3px;padding-right:10px;padding-bottom:3px;padding-left:10px;font-size:14px;text-transform:capitalize"><?php echo esc_html__( 'new', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":169,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-wishlist-btn"} -->
<figure class="wp-block-image size-full is-resized product-wishlist-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/heart.png" alt="" class="wp-image-169" style="width:auto;height:16px"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":170,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-cart-btn"} -->
<figure class="wp-block-image size-full is-resized product-cart-btn"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/cart.png" alt="" class="wp-image-170" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"product-content","layout":{"type":"default"}} -->
<div class="wp-block-group product-content"><!-- wp:heading {"level":6,"className":"product-card-title","style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","textTransform":"capitalize"}}} -->
<h6 class="wp-block-heading product-card-title" style="font-size:18px;font-style:normal;font-weight:500;text-transform:capitalize"><?php echo esc_html__( 'teddy gift set', 'salecraft-ecommerce-v2' ); ?></h6>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"product-card-desc","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"typography":{"fontSize":"13px"},"spacing":{"margin":{"top":"5px"}}},"textColor":"contrast"} -->
<p class="product-card-desc has-contrast-color has-text-color has-link-color" style="margin-top:5px;font-size:13px"><?php echo esc_html__( 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"product-btm-box","style":{"spacing":{"margin":{"top":"5px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group product-btm-box" style="margin-top:5px"><!-- wp:group {"className":"product-price-box","style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group product-price-box"><!-- wp:paragraph {"className":"product-sale","style":{"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-sale" style="font-size:16px;font-style:normal;font-weight:600"><?php echo esc_html__( '$49.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"product-reg","style":{"typography":{"fontSize":"11px","textDecoration":"line-through","fontStyle":"normal","fontWeight":"600"}}} -->
<p class="product-reg" style="font-size:11px;font-style:normal;font-weight:600;text-decoration:line-through"><?php echo esc_html__( '$59.00', 'salecraft-ecommerce-v2' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"id":150,"width":"auto","height":"16px","sizeSlug":"full","linkDestination":"none","className":"product-card-rating"} -->
<figure class="wp-block-image size-full is-resized product-card-rating"><img src="<?php echo esc_url( get_theme_file_uri() );?>/assets/images/rating.png" alt="" class="wp-image-150" style="width:auto;height:16px"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:spacer {"height":"35px"} -->
<div style="height:35px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->

<?php } ?>