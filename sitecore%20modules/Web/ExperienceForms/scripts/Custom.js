
$(document).ready(function () {
	$('p.ThankYouMessage').hide();
	      var form = $('.demo01-newsForm');
      if (form) {
        form.on("submit", function() {
          $('.demo01-newsForm input.btn').prop("disabled", true);
          $('.demo01-newsForm').toggleClass('hidden');
          $('p.ThankYouMessage').show();
        });
      }
	  
	  $('.footerAddress .contact-locations').hide();
    $('.footerAddress .'+$('#ddlFooterLocation').val()+'-address').show();
	$('.ddlcontactlocations').on('change',function(){
		  $('.footerAddress .contact-locations').hide();
			$('.footerAddress .'+$('#ddlFooterLocation').val()+'-address').show();
	});
});
