
/*** Update and submit the vote form when user makes vote selection ***/
$("button").click(function() {
	$("input[name='index']").val($(this).data('index'));
	$("input[name='vote']").val($(this).data('vote'));
	$("#vote").submit();
});