var attachmentForUser = <user_information>;
    function setConciergeAttachment(attachment) {
        window.capacityConcierge.set_attachment(attachment);
    }
    function setEventHook_GcTrigger(targetResponsePartial, inquiry, isSilentInquiry, delayMs) {
        window.capacityConcierge.bind_event_hooks({
            message_event: function message_event(event) {
                if (event.event !== "MESSAGE:RECEIVE:RESPONSE"
                    || event.value.indexOf(targetResponsePartial) === -1
                    || !event.state
                    || event.state.isBusy)
                    return;
                window.capacityConcierge.ask(
                  inquiry,
                  isSilentInquiry,
                  delayMs,
                  false,
                  "CUSTOM_INQUIRY"
                );
            }
        }); 
    }
    var bodyObserver = new MutationObserver(function() {
        var element = document.querySelector("#ais-concierge .ajc_root");
        if (element) {
            bodyObserver.disconnect();
            setConciergeAttachment(attachmentForUser);
            if (this.isSurveyEnabled) {
                var targetResponsePartial = "The agent has ended the chat."; // Response text for the script to listen to, only needs to be a partial match
                var inquiry = "live chat survey"; // Inquiry to trigger
                var isSilentInquiry = true; // Whether the inquiry chat bubble should be displayed
                var delayMs = 0; // Add a delay (in ms) before inquiry is triggered, if desired
                setEventHook_GcTrigger(targetResponsePartial, inquiry, isSilentInquiry, delayMs);   
            }
        }
    });
    bodyObserver.observe(document.body, {
        childList: true
    });
