<?php
/**
 * User Earnings template
 *
 * This template can be overridden by copying it to yourtheme/gamipress/earnings.php
 */
global $gamipress_template_args;

// Shorthand
$a = $gamipress_template_args;

// Execute the query
$user_earnings = $a['query']->get_results();

?>

<div class="gamipress-earnings">

    <div class="gamipress-earnings-atts">

        <?php
        /**
         * Before render earnings atts
         *
         * @since 1.4.9
         *
         * @param array $template_args Template received arguments
         */
        do_action( 'gamipress_before_render_earnings_atts', $a ); ?>

        <?php // Hidden fields for ajax request
        foreach( $a as $arg => $arg_value ) :

            // Skip excluded args
            if( in_array( $arg, array( 'query' ) ) ) {
                continue;
            } ?>
            <input type="hidden" name="<?php echo $arg; ?>" value="<?php echo ( is_array( $arg_value ) ? implode(',', $arg_value ) : $arg_value ); ?>">
        <?php endforeach; ?>

        <?php
        /**
         * After render earnings atts
         *
         * @since 1.4.9
         *
         * @param array $template_args Template received arguments
         */
        do_action( 'gamipress_after_render_earnings_atts', $a ); ?>

    </div>

    <?php
    /**
     * Before render earnings
     *
     * @since 1.0.0
     *
     * @param array $template_args Template received arguments
     */
    do_action( 'gamipress_before_render_earnings', $a ); ?>

    <?php if( $a['query']->found_results > 0 ) : ?>

        <?php
        $earnings_columns = array(
            'thumbnail'     => __( 'Thumbnail', 'gamipress' ),
            'description'   => __( 'Description', 'gamipress' ),
            'date'          => __( 'Date', 'gamipress' ),
            'points'        => __( 'Points', 'gamipress' ),
        );

        /**
         * Earnings columns
         *
         * @since 1.0.0
         *
         * @param array $earnings_columns   Earnings columns to be rendered
         * @param array $template_args      Template received arguments
         */
        $earnings_columns = apply_filters( 'gamipress_earnings_columns', $earnings_columns, $a );
        ?>

        <table id="gamipress-earnings-table" class="gamipress-earnings-table">

            <thead>

                <tr>

                    <?php foreach( $earnings_columns as $column_name => $column_label ) : ?>
                        <th class="gamipress-earnings-col gamipress-earnings-col-<?php echo $column_name; ?>"><?php echo $column_label; ?></th>
                    <?php endforeach ?>

                </tr>

            </thead>

            <tbody>

            <?php foreach( $user_earnings as $user_earning ) : ?>

                <?php // Skip earnings that post assigned has been deleted
                if( ! gamipress_post_exists( $user_earning->post_id ) ) { continue; } ?>

                <tr>

                    <?php foreach( $earnings_columns as $column_name => $column_label ) : ?>

                        <?php
                        /**
                         * Render earnings column
                         *
                         * @since 1.0.0
                         *
                         * @see gamipress_earnings_render_column()
                         *
                         * @param string    $column_output  Default column output
                         * @param string    $column_name    The column name
                         * @param stdClass  $user_earning   The column name
                         * @param array     $template_args  Template received arguments
                         */
                        $column_output = apply_filters( 'gamipress_earnings_render_column', '', $column_name, $user_earning, $a );
                        ?>

                        <td class="gamipress-earnings-col gamipress-earnings-col-<?php echo $column_name; ?>"><?php echo $column_output; ?></td>
                    <?php endforeach ?>

                </tr>

            <?php endforeach; ?>

            </tbody>

        </table><!-- .gamipress-earnings-table -->

        <?php // Pagination
        if( $a['pagination'] === 'yes' ) : ?>

            <?php
            /**
             * Before render earnings list pagination
             *
             * @since 1.4.9
             *
             * @param array $template_args Template received arguments
             */
            do_action( 'gamipress_before_render_earnings_list_pagination', $a ); ?>

            <div id="gamipress-earnings-pagination" class="gamipress-earnings-pagination navigation">
                <?php echo paginate_links( array(
                    'base'    => str_replace( 999999, '%#%', esc_url( get_pagenum_link( 999999 ) ) ),
                    'format'  => '?paged=%#%',
                    'current' => max( 1, get_query_var( 'paged' ) ),
                    'total'   => ceil( $a['query']->found_results / $a['limit'] )
                ) ); ?>
            </div>

            <?php
            /**
             * After render earnings list pagination
             *
             * @since 1.4.9
             *
             * @param array $template_args Template received arguments
             */
            do_action( 'gamipress_after_render_earnings_list_pagination', $a ); ?>

            <?php // Loading spinner ?>
            <div id="gamipress-earnings-spinner" class="gamipress-spinner" style="display: none;"></div>

        <?php endif; ?>

    <?php else : ?>

        <p id="gamipress-earnings-no-results"><?php echo __( 'You have not earned anything yet.', 'gamipress' ); ?></p>

    <?php endif; ?>

    <?php
    /**
     * After render earnings
     *
     * @since 1.0.0
     *
     * @param array $template_args Template received arguments
     */
    do_action( 'gamipress_after_render_earnings', $a ); ?>

</div>
