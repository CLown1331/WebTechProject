var __is_jadewits_user_logged_in = 0;
		var __jadewits_next_url = encodeURIComponent(window.location.href);
		var container = $('#account_bar');
		if( container ){
			container.html('<a class=\"login_link\" id=\"_jadewits_login\" href=\"https://profiles.prothom-alo.com/login?next=\">Login</a><a class=\"register_link\" id=\"_jadewits_register\" href=\"https://profiles.prothom-alo.com/register/?next=\">Register</a>');
			$(document).ready(function(){
				$('.profile_link_holder').html($('#jw_profile_link a').html());
				});
			$('#_jadewits_logout').attr('href',$('#_jadewits_logout').attr('href')+__jadewits_next_url);
			$('#_jadewits_login').attr('href',$('#_jadewits_login').attr('href')+__jadewits_next_url);
			$('#_jadewits_register').attr('href',$('#_jadewits_register').attr('href')+__jadewits_next_url);
			
						}