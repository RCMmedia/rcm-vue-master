(function ( $ ) {

	// Dynamically show/hide achievement meta inputs based on "Earned By" selection
	$("#_gamipress_earned_by").change( function() {

		// Define our potentially unnecessary inputs
		var gamipress_points_required = $('#_gamipress_points_required').closest('.cmb-row');
		var gamipress_rank_type_required = $('#_gamipress_rank_type_required').parent().parent();
		var gamipress_rank_required = $('#_gamipress_rank_required').parent().parent();

		// Hide our potentially unnecessary inputs
		gamipress_points_required.hide();
		gamipress_rank_type_required.hide();
		gamipress_rank_required.hide();

		// Determine which inputs we should show
		 if ( $(this).val() === 'points' ) {
			gamipress_points_required.show();
		} else if ( $(this).val() === 'rank' ) {
			gamipress_rank_type_required.show();
			$('#_gamipress_rank_type_required').change();
			//gamipress_rank_required.show();
		}
	}).change();

	$('#_gamipress_rank_type_required').change(function() {

		var $this = $(this);

		var rank_type = $(this).val();

		if( rank_type === '' ) {
			return;
		}

		$('<span class="spinner is-active" style="float: none;"></span>').insertAfter( $this );

		var gamipress_rank_required = $('#_gamipress_rank_required').parent().parent();
		var gamipress_rank_required_select = $('#_gamipress_rank_required');

		gamipress_rank_required.hide();

		if( rank_type !== '' && $("#_gamipress_earned_by").val() === 'rank' ) {

			$.post(
				ajaxurl,
				{
					action: 'gamipress_get_ranks_options_html',
					post_type: rank_type,
					selected: gamipress_rank_required_select.val(),
				},
				function( response ) {

					$this.next('.spinner').remove();

					gamipress_rank_required_select.html( response );

					// During request user can change the earned by value, so prevent to show if it was changed
					if( $("#_gamipress_earned_by").val() === 'rank' ) {
						gamipress_rank_required.show();
					}
				}
			);

		} else {
			gamipress_rank_required.hide();
		}
	});

	// Dynamically show/hide achievement meta inputs based on "Unlock with Points" checkbox
	$('#_gamipress_unlock_with_points').change(function() {
		var target = $('.cmb2-id--gamipress-points-to-unlock');

		if( $(this).prop('checked') ) {
			target.slideDown(250);
		} else {
			target.slideUp(250);
		}
	});

	if( ! $('#_gamipress_unlock_with_points').prop('checked') ) {
		$('.cmb2-id--gamipress-points-to-unlock').hide();
	}

	$('.gamipress-form').on( 'keyup', 'input#post_name', function() {
		var field = $(this);
		var slug = $(this).val();
		var preview = $(this).next('.cmb2-metabox-description').find('.gamipress-post-name');

		if( preview.length ) {
			preview.text(slug);
		}

		var label = '';

		if(  $('#post_type').val() === 'achievement-type' ) {
			label = 'Achievement Type';
		} else if(  $('#post_type').val() === 'rank-type' ) {
			label = 'Rank Type';
		} else {
			label = 'Points Type';
		}

		// Delete any existing version of this warning
		$('#slug-warning').remove();

		// Only allow alphanumeric characters, "-" adn "_"
		if( /[^a-zA-Z0-9\-_]/.test( slug ) ) {
			field.css({'background':'#faa', 'color':'#a00', 'border-color':'#a55' });

			field.parent().append('<span id="slug-warning" class="cmb2-metabox-description" style="color: #a00;">' + label + '\'s slug can\'t contain special characters. Only alphanumeric characters are allowed.</span>');

			// Disable the save button
			$('input#publish').prop( 'disabled', true );

			return false;
		}

		// Throw a warning on Points/Achievement Type editor if slig is > 20 characters
		if ( slug.length > 20 ) {
			// Set input to look like danger
			field.css({'background':'#faa', 'color':'#a00', 'border-color':'#a55' });

			// Output a custom warning
			// TODO: Localization here
			field.parent().append('<span id="slug-warning" class="cmb2-metabox-description" style="color: #a00;">' + label + '\'s slug supports a maximum of 20 characters.</span>');

			// Disable the save button
			$('input#publish').prop( 'disabled', true );

			return false;
		}

		// Restore the input style if there is no error
		field.css({'background':'', 'color':'', 'border-color':''});

		// Re-enable the save button
		if( $('input#publish').prop( 'disabled' ) ) {
			$('input#publish').prop( 'disabled', false );
		}
	});

	$('.gamipress-form input#post_name').trigger( 'keyup' );

    // Award type select
    if( $("#gamipress-award-type-select").length ) {

        $("#gamipress-award-type-select").change(function(){
            if ( 'all' == this.value )
                $("#gamipress-awards-options").children().show();
            else
                $("#" + this.value).show().siblings().hide();
        }).change();

    }

	// User award/revoke ajax from awards table
	$('body').on('click', '#gamipress-awards-options .gamipress-award-achievement, #gamipress-awards-options .gamipress-revoke-achievement', function(e) {
		e.preventDefault();

		var $this = $(this);

		// Bail if already running an ajax request
		if( $this.hasClass('disabled') ) {
			return;
		}

		var sibling_selector = ( $this.hasClass('gamipress-award-achievement') ? '.gamipress-revoke-achievement' : '.gamipress-award-achievement' );

		// Add a custom class to avoid multiples clicks
		$this.addClass('disabled');

		// Also, disable the other link
		$this.parent().find(sibling_selector).addClass('disabled');

		// Add a loader
		$( '<span class="spinner is-active"></span>' ).insertAfter( $this );

        // Make the request
		$.get( $this.attr('href'), function( response ) {

            // Update this awards table (so do not neet to remove the loader and enable the links again)
            $this.closest('.gamipress-table').html( $(response).find('#' + $this.closest('.gamipress-table').attr('id') + '.gamipress-table').html() );

            // Force user earnings table to refresh
            var table = $('.ct-ajax-list-table[data-object="gamipress_user_earnings"]');

            ct_ajax_list_table_paginate_table( table, table.find('input#current-page-selector').val() );
		} );
	});

    // User award/revoke ajax from user earnings table
    $('body').on('click', '.gamipress_user_earnings .gamipress-revoke-user-earning', function(e) {

        e.preventDefault();

        var $this = $(this);

        // Bail if already running an ajax request
        if( $this.hasClass('disabled') ) {
            return;
        }

        // Add a custom class to avoid multiples clicks
        $this.addClass('disabled');

        // Add a loader
        $( '<span class="spinner is-active"></span>' ).insertAfter( $this );

        // Make the request
        $.get( $this.attr('href'), function( response ) {

            // Update this awards table (so do not neet to remove the loader and enable the links again)
            $this.closest('.gamipress-table').html( $(response).find('#' + $this.closest('.gamipress-table').attr('id') + '.gamipress-table').html() );

            // Force user earnings table to refresh
            var table = $('.ct-ajax-list-table[data-object="gamipress_user_earnings"]');

            ct_ajax_list_table_paginate_table( table, table.find('input#current-page-selector').val() );
        } );

    });

	// Add-ons page
	if( $('.gamipress_page_gamipress_add_ons').length ) {

		// Add-ons tabs
		$('.gamipress_page_gamipress_add_ons .wp-filter a').click(function(e) {
			e.preventDefault();

			if( $(this).hasClass('current') ) {
				return;
			}

			var current = $(this).closest('.wp-filter').find('a.current');

			// Toggle plugin cards visibility
			$('.gamipress-plugin-card.' + current.data('target')).hide();

			$('.gamipress-plugin-card.' + $(this).data('target')).fadeIn(250);

			// Toggle current class
			current.removeClass('current');
			$(this).addClass('current');
		});

		// Hide all plugins cards
		$('.gamipress-add-ons .gamipress-plugin-card:not(.' + $('.gamipress_page_gamipress_add_ons .wp-filter a.current').data('target') + ')').hide();

		// Trigger click on first tab
		$('.gamipress_page_gamipress_add_ons .wp-filter a.current').trigger('click');

	}

	// Auto initialize upgrade if user reloads the page during an upgrade
	if( $('#gamipress-upgrade-notice').find('.gamipress-upgrade-progress[data-running-upgrade]').length ) {
		gamipress_start_upgrade( $('#gamipress-upgrade-notice').find('.gamipress-upgrade-progress[data-running-upgrade]').data('running-upgrade') );
	}

})( jQuery );

var gamipress_current_upgrade_info;
var gamipress_current_upgrade_progress;
var gamipress_current_upgrade_cancelled = false;

// Start upgrade
function gamipress_start_upgrade( version ) {

	var $ = $ || jQuery;
	version = version.replace('.', '').replace('.', '').replace('.', '');

	$('#gamipress-upgrade-notice').html(
		'<p>Upgrading GamiPress database... <span></span></p>'
		+ '<div class="gamipress-upgrade-progress"><div class="gamipress-upgrade-progress-bar" style="width: 0%;"></div></div>'
		+ '<p style="display: none;">'
			+ '<a id="gamipress-cancel-upgrade" href="#" class="button">Cancel Upgrade</a>'
		+ '</p>'
	);

	$.ajax({
		url: ajaxurl,
		data: {
			action: 'gamipress_' + version + '_upgrade_info'
		},
		success: function( response ) {

			// Upgrade done!
			if( response.data.upgraded !== undefined && response.data.upgraded ) {
				$('#gamipress-upgrade-notice').html('<p>Upgrade has been already completed.</p><div class="gamipress-upgrade-progress"><div class="gamipress-upgrade-progress-bar" style="width: 100%;"></div></div>');
				return;
			}

			// Update progress vars
			gamipress_current_upgrade_info = response.data.total;
			gamipress_current_upgrade_progress = 0;

            // Show a visual text with remaining entries
            $('#gamipress-upgrade-notice p:first span').html( gamipress_current_upgrade_info - gamipress_current_upgrade_progress + ' remaining entries' );

            // Add a click event on the upgrade cancel button
            // Note: Function is placed here because clicking fast on start upgrade could provoke cancelling it at start
            $('body').click('#gamipress-cancel-upgrade', function(e) {
                e.preventDefault();

                $('#gamipress-upgrade-notice').html('<p>Cancelling upgrade...</p>');

                gamipress_current_upgrade_cancelled = true;

                gamipress_stop_upgrade( version, true );
            });

            // Show the cancel upgrade button
            $('#gamipress-cancel-upgrade').parent().show();

			gamipress_run_upgrade( version );

		},
		error: function( response ) {
			gamipress_stop_upgrade( version );
			$('#gamipress-upgrade-notice').html('<p class="error">Upgrading process failed.</p>');
		}
	});

}

// Run upgrade
function gamipress_run_upgrade( version ) {

    if( gamipress_current_upgrade_cancelled ) {
        return;
    }

	var $ = $ || jQuery;
	version = version.replace('.', '').replace('.', '').replace('.', '');

	$.ajax({
		url: ajaxurl,
		data: {
			action: 'gamipress_process_' + version + '_upgrade',
			current: gamipress_current_upgrade_progress,
		},
		success: function( response ) {

			// Upgrade done!
			if( response.data.upgraded !== undefined && response.data.upgraded ) {
				$('#gamipress-upgrade-notice').html('<p>Upgrading process finished successfully.</p><div class="gamipress-upgrade-progress"><div class="gamipress-upgrade-progress-bar" style="width: 100%;"></div></div>');
				return;
			}

			gamipress_current_upgrade_progress = response.data.current;

			// Upgraded successfully
			if( gamipress_current_upgrade_progress >= gamipress_current_upgrade_info ) {
				$('#gamipress-upgrade-notice').html('<p>Upgrading process finished successfully.</p><div class="gamipress-upgrade-progress"><div class="gamipress-upgrade-progress-bar" style="width: 100%;"></div></div>');
				return;
			}

            // Show a visual text with remaining entries
            $('#gamipress-upgrade-notice p:first span').html( gamipress_current_upgrade_info - gamipress_current_upgrade_progress + ' remaining entries' );

			// Update progress bar width
			$('#gamipress-upgrade-notice .gamipress-upgrade-progress .gamipress-upgrade-progress-bar').attr('style', 'width: ' + ( ( gamipress_current_upgrade_progress / gamipress_current_upgrade_info ) * 100 ) + '%')

			gamipress_run_upgrade( version );

		},
		error: function( response ) {
			gamipress_stop_upgrade( version );
			$('#gamipress-upgrade-notice').html('<p class="error">Upgrading process failed.</p>');
		}
	});

}

// Stop upgrade
function gamipress_stop_upgrade( version, show_result ) {

    if( show_result === undefined ) {
        show_result = false;
    }

	var $ = $ || jQuery;
	version = version.replace('.', '').replace('.', '').replace('.', '');

	$.ajax({
		url: ajaxurl,
		data: {
			action: 'gamipress_stop_process_' + version + '_upgrade'
		},
        success: function( response ) {
            if( show_result === true ) {
                $('#gamipress-upgrade-notice').html('<p class="error">Upgrade cancelled.</p>');
            }
        },
        error: function( response ) {
            if( show_result === true ) {
                $('#gamipress-upgrade-notice').html('<p class="error">Upgrade cancellation failed.</p>');
            }
        }
	});

}
