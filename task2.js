const INITIAL_ROOMS = [

    {
        name: "Balcony",
        floor: 2,

        guests: [
            {
                name: "Aigerim",
                color: "green",
                arrival: "20:45",
                aitu: true,
                things: ["cup", "crumbs"]
            },

            {
                name: "Aliya",
                color: "black",
                arrival: "21:15",
                aitu: false,
                things: ["phone", "cup"]
            },

            {
                name: "Madina",
                color: "green",
                arrival: "22:10",
                aitu: false,
                things: ["phone", "bag", "crumbs"]
            },

            {
                name: "Ivan",
                color: "black",
                arrival: "20:10",
                aitu: true,
                things: ["cup"]
            }
        ]
    },


    {
        name: "Hall",
        floor: 2,

        guests: [
            {
                name: "Arman",
                color: "yellow",
                arrival: "20:35",
                aitu: false,
                things: ["bag", "glasses"]
            },

            {
                name: "Sophia",
                color: "purple",
                arrival: "21:20",
                aitu: true,
                things: ["phone"]
            },

            {
                name: "Dias",
                color: "green",
                arrival: "19:45",
                aitu: true,
                things: []
            },

            {
                name: "Bekzat",
                color: "purple",
                arrival: "20:55",
                aitu: false,
                things: ["bag", "cup", "crumbs"]
            },

            {
                name: "Aruzhan",
                color: "blue",
                arrival: "21:50",
                aitu: true,
                things: ["phone"]
            },

            {
                name: "Saule",
                color: "green",
                arrival: "21:25",
                aitu: false,
                things: ["glasses"]
            }
        ]
    },


    {
        name: "Kitchen",
        floor: 1,

        guests: [
            {
                name: "Nurlan",
                color: "red",
                arrival: "19:40",
                aitu: true,
                things: ["phone", "cup"]
            },

            {
                name: "Emma",
                color: "black",
                arrival: "20:15",
                aitu: false,
                things: ["bag"]
            },

            {
                name: "Timur",
                color: "green",
                arrival: "21:05",
                aitu: true,
                things: ["phone", "bag", "crumbs"]
            },

            {
                name: "Sergey",
                color: "yellow",
                arrival: "20:50",
                aitu: false,
                things: []
            },

            {
                name: "Yerlan",
                color: "red",
                arrival: "21:40",
                aitu: true,
                things: ["glasses", "phone"]
            },

            {
                name: "Kamila",
                color: "green",
                arrival: "20:05",
                aitu: false,
                things: ["cup"]
            }
        ]
    },


    {
        name: "Living room",
        floor: 1,

        guests: [
            {
                name: "Daniel",
                color: "blue",
                arrival: "19:55",
                aitu: true,
                things: ["glasses"]
            },

            {
                name: "Zarina",
                color: "green",
                arrival: "21:10",
                aitu: false,
                things: ["bag", "phone", "crumbs"]
            },

            {
                name: "Natasha",
                color: "yellow",
                arrival: "20:30",
                aitu: true,
                things: []
            },

            {
                name: "Askar",
                color: "black",
                arrival: "21:00",
                aitu: true,
                things: ["phone"]
            },

            {
                name: "Inkar",
                color: "purple",
                arrival: "20:20",
                aitu: false,
                things: ["bag"]
            }
        ]
    }

];


let rooms = cloneInitialRooms();

let activeGuestName = null;

let moveInProgress = false;



const itemIcons = {

    phone: "📱",
    glasses: "👓",
    bag: "👜",
    cup: "☕",
    crumbs: "🍰"

};



const caseDescriptions = {

    1: "Who is in the hall?",

    2: "Who is dressed in yellow or purple?",

    3: "Which AITU students are upstairs?",

    4: "Who has glasses or a bag?",

    5: "Who came with nothing at all?",

    6: "Who has a phone but no bag?",

    7: "Who arrived between 20:30 and 21:00, both included?",

    8: "Who arrived after 21:00 and is not an AITU student?",

    9: "Who stands right next to Askar?",

    10: "Who stands last in each room?",

    11: "Who stands third in each room?",

    12: "Who stands after Timur in his room?",

    13: "Who stands right before someone in black?",

    14: "In which room is Aruzhan?",

    15: "Which rooms have fewer than 6 guests?",

    16: "Which rooms have a cup but nobody wears glasses?",

    17: "Who came first to each room?",

    18: "Miras joins Askar and Inkar.",

    19: "Natasha goes home.",

    20: "Who took the cake?"

};



const caseChains = {

    1:
        `$(".room[data-room="Hall"] .guest-card")`,

    2:
        `$(".guest-card.color-yellow, .guest-card.color-purple")`,

    3:
        `$(".floor[data-floor="2"] .guest-card.aitu")`,

    4:
        `$(".guest-card.has-glasses, .guest-card.has-bag")`,

    5:
        `$(".guest-card").not(".has-phone").not(".has-glasses").not(".has-bag").not(".has-cup").not(".has-crumbs")`,

    6:
        `$(".guest-card.has-phone").not(".has-bag")`,

    7:
        `$(".guest-card").filter(function () { return $(this).attr("data-arrival") >= "20:30" && $(this).attr("data-arrival") <= "21:00"; })`,

    8:
        `$(".guest-card").not(".aitu").filter(function () { return $(this).attr("data-arrival") > "21:00"; })`,

    9:
        `$(".guest-card[data-name="Askar"]").prev(".guest-card").add($(".guest-card[data-name="Askar"]").next(".guest-card"))`,

    10:
        `$(".guest-list .guest-card:last-child")`,

    11:
        `$(".guest-list .guest-card:nth-child(3)")`,

    12:
        `$(".guest-card[data-name="Timur"]").nextAll(".guest-card")`,

    13:
        `$(".guest-card.color-black").prev(".guest-card")`,

    14:
        `$(".guest-card[data-name="Aruzhan"]").closest(".room")`,

    15:
        `$(".room").filter(function () { return $(this).find(".guest-card").length < 6; })`,

    16:
        `$(".room:has(.has-cup):not(:has(.has-glasses))")`,

    17:
        `$(".guest-card").filter(function () { const card = $(this); const own = card.attr("data-arrival"); const first = card.closest(".room").find(".guest-card").map(function () { return $(this).attr("data-arrival"); }).get().sort()[0]; return own === first; })`,

    18:
        `createGuestCard(miras).hide().insertAfter($('[data-name="Askar"]')).fadeIn()`,

    19:
        `$(".guest-card[data-name='Natasha']").fadeOut(function () { $(this).remove(); })`,

    20:
        `$(".floor[data-floor='1'] .guest-card.has-crumbs:not(.has-cup)").filter(/* time + AITU neighbour */)`

};



/* ---------------------------------
   COPY INITIAL PARTY
--------------------------------- */

function cloneInitialRooms() {

    const copy =
        JSON.parse(
            JSON.stringify(
                INITIAL_ROOMS
            )
        );


    for (const room of copy) {

        room.originalOrder =
            room.guests.map(
                function (guest) {

                    return guest.name;

                }
            );


        room.sorted = false;

    }


    return copy;

}



/* ---------------------------------
   FIND ROOM
--------------------------------- */

function findRoom(roomName) {

    for (const room of rooms) {

        if (
            room.name === roomName
        ) {

            return room;

        }

    }


    return null;

}



/* ---------------------------------
   FIND GUEST
--------------------------------- */

function findGuestLocation(
    guestName
) {

    for (const room of rooms) {

        for (
            let index = 0;
            index < room.guests.length;
            index++
        ) {

            if (
                room.guests[index].name
                ===
                guestName
            ) {

                return {

                    room: room,

                    guest:
                        room.guests[index],

                    index: index

                };

            }

        }

    }


    return null;

}



/* ---------------------------------
   BUILD CASE BUTTONS
--------------------------------- */

function buildCaseButtons() {

    $("#caseButtons").empty();


    $.each(
        caseDescriptions,

        function (
            caseNumber,
            description
        ) {

            const $button =
                $("<button>")
                    .attr(
                        "type",
                        "button"
                    )
                    .addClass(
                        "case-button"
                    )
                    .attr(
                        "data-case",
                        caseNumber
                    )
                    .attr(
                        "title",
                        description
                    )
                    .text(
                        "Case "
                        + caseNumber
                    );


            $("#caseButtons")
                .append(
                    $button
                );

        }
    );

}



/* ---------------------------------
   CREATE GUEST CARD
--------------------------------- */

function createGuestCard(
    guest
) {

    const $card =
        $("<article>")
            .addClass(
                "guest-card"
            )
            .addClass(
                "color-"
                + guest.color
            )
            .attr({

                "data-name":
                    guest.name,

                "data-arrival":
                    guest.arrival,

                "data-aitu":
                    guest.aitu,

                "data-color":
                    guest.color,

                "data-items":
                    guest.things.join(",")

            });


    if (guest.aitu) {

        $card.addClass(
            "aitu"
        );

    }


    $.each(
        guest.things,

        function (
            index,
            thing
        ) {

            $card.addClass(
                "has-" + thing
            );

        }
    );


    const $ring =
        $("<div>")
            .addClass(
                "avatar-ring"
            );


    const $avatar =
        $("<img>")
            .attr(
                "src",
                "https://api.dicebear.com/9.x/open-peeps/svg?seed="
                +
                encodeURIComponent(
                    guest.name
                )
            )
            .attr(
                "alt",
                guest.name
            );


    $ring.append(
        $avatar
    );


    const $name =
        $("<strong>")
            .addClass(
                "guest-name"
            )
            .text(
                guest.name
            );


    const $arrival =
        $("<span>")
            .addClass(
                "arrival"
            )
            .text(
                "◷ "
                + guest.arrival
            );


    const $things =
        $("<div>")
            .addClass(
                "things"
            );


    if (
        guest.things.length === 0
    ) {

        $things.append(

            $("<span>")
                .addClass(
                    "no-items"
                )
                .text(
                    "No items"
                )

        );

    } else {

        $.each(
            guest.things,

            function (
                index,
                thing
            ) {

                $things.append(

                    $("<span>")
                        .addClass(
                            "thing-icon"
                        )
                        .attr(
                            "title",
                            thing
                        )
                        .attr(
                            "aria-label",
                            thing
                        )
                        .text(
                            itemIcons[
                                thing
                            ]
                        )

                );

            }
        );

    }


    $card
        .append($ring)
        .append($name)
        .append($arrival);


    if (guest.aitu) {

        $card.append(

            $("<span>")
                .addClass(
                    "aitu-badge"
                )
                .text(
                    "AITU"
                )

        );

    }


    $card.append(
        $things
    );


    return $card;

}



/* ---------------------------------
   BUILD PARTY
--------------------------------- */

function buildParty() {

    $("#party").empty();


    for (const room of rooms) {

        room.sorted = false;

    }


    $.each(
        [2, 1],

        function (
            index,
            floorNumber
        ) {

            const $floor =
                $("<section>")
                    .addClass(
                        "floor"
                    )
                    .attr(
                        "data-floor",
                        floorNumber
                    );


            const $floorLabel =
                $("<div>")
                    .addClass(
                        "floor-label"
                    )
                    .text(
                        "FLOOR "
                        + floorNumber
                    );


            const $floorRooms =
                $("<div>")
                    .addClass(
                        "floor-rooms"
                    );


            $.each(
                rooms,

                function (
                    roomIndex,
                    room
                ) {

                    if (
                        room.floor
                        !==
                        floorNumber
                    ) {

                        return;

                    }


                    const $room =
                        $("<section>")
                            .addClass(
                                "room"
                            )
                            .attr(
                                "data-room",
                                room.name
                            )
                            .attr(
                                "data-floor",
                                room.floor
                            );


                    const $header =
                        $("<header>")
                            .addClass(
                                "room-header"
                            );


                    const $title =
                        $("<h3>")
                            .text(
                                room.name
                            );


                    const $sortButton =
                        $("<button>")
                            .attr(
                                "type",
                                "button"
                            )
                            .addClass(
                                "sort-room"
                            )
                            .attr(
                                "data-room",
                                room.name
                            )
                            .text(
                                "Sort by time"
                            );


                    const $count =
                        $("<span>")
                            .addClass(
                                "room-count"
                            )
                            .text(
                                room.guests.length
                            );


                    const $guestList =
                        $("<div>")
                            .addClass(
                                "guest-list"
                            );


                    $.each(
                        room.guests,

                        function (
                            guestIndex,
                            guest
                        ) {

                            $guestList.append(
                                createGuestCard(
                                    guest
                                )
                            );

                        }
                    );


                    $header
                        .append($title)
                        .append(
                            $sortButton
                        )
                        .append($count);


                    $room
                        .append($header)
                        .append(
                            $guestList
                        );


                    $floorRooms
                        .append(
                            $room
                        );

                }
            );


            $floor
                .append(
                    $floorLabel
                )
                .append(
                    $floorRooms
                );


            $("#party")
                .append(
                    $floor
                );

        }
    );

}



/* ---------------------------------
   CLEAR HIGHLIGHT
--------------------------------- */

function clearHighlights() {

    $(".guest-card")
        .stop(
            true,
            true
        )
        .removeClass(
            "found"
        )
        .css(
            "top",
            "0"
        );


    $(".room")
        .removeClass(
            "found-room"
        );

}



/* ---------------------------------
   CLEAR SPOTLIGHT
--------------------------------- */

function clearSpotlight() {

    $(".guest-card")
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            1
        )
        .removeClass(
            "found"
        )
        .css(
            "top",
            "0"
        );


    $(".room")
        .removeClass(
            "found-room"
        );


    $("#resultText")
        .text(
            "Spotlight cleared."
        );

}



/* ---------------------------------
   JUMP FOUND GUESTS
--------------------------------- */

function jumpGuests(
    $guests
) {

    $guests.each(
        function () {

            $(this)
                .stop(
                    true,
                    true
                )
                .animate(
                    {
                        top: "-12px"
                    },
                    130
                )
                .animate(
                    {
                        top: "0px"
                    },
                    130
                );

        }
    );

}



/* ---------------------------------
   GUEST RESULTS
--------------------------------- */

function showGuestResults(
    $guests
) {

    clearHighlights();


    $(".guest-card")
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            0.2
        );


    $guests
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            1
        )
        .addClass(
            "found"
        );


    jumpGuests(
        $guests
    );


    const names =
        $guests
            .map(
                function () {

                    return $(this)
                        .attr(
                            "data-name"
                        );

                }
            )
            .get();


    if (
        names.length === 0
    ) {

        $("#resultText")
            .text(
                "Nobody found."
            );

        return;

    }


    $("#resultText")
        .text(
            names.length
            + " found: "
            + names.join(", ")
        );

}



/* ---------------------------------
   ROOM RESULTS
--------------------------------- */

function showRoomResults(
    $rooms
) {

    clearHighlights();


    $(".guest-card")
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            0.2
        );


    $rooms
        .addClass(
            "found-room"
        )
        .find(
            ".guest-card"
        )
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            1
        );


    const names =
        $rooms
            .map(
                function () {

                    return $(this)
                        .attr(
                            "data-room"
                        );

                }
            )
            .get();


    $("#resultText")
        .text(
            names.length
            + " room(s): "
            + names.join(", ")
        );

}



/* ---------------------------------
   CASE RESULTS
--------------------------------- */

function getCaseResult(
    caseNumber
) {

    switch (
        caseNumber
    ) {


        case 1:

            return $(
                '.room[data-room="Hall"] .guest-card'
            );


        case 2:

            return $(
                ".guest-card.color-yellow, "
                +
                ".guest-card.color-purple"
            );


        case 3:

            return $(
                '.floor[data-floor="2"] '
                +
                ".guest-card.aitu"
            );


        case 4:

            return $(
                ".guest-card.has-glasses, "
                +
                ".guest-card.has-bag"
            );


        case 5:

            return $(
                ".guest-card"
            )
                .not(
                    ".has-phone"
                )
                .not(
                    ".has-glasses"
                )
                .not(
                    ".has-bag"
                )
                .not(
                    ".has-cup"
                )
                .not(
                    ".has-crumbs"
                );


        case 6:

            return $(
                ".guest-card.has-phone"
            )
                .not(
                    ".has-bag"
                );


        case 7:

            return $(
                ".guest-card"
            )
                .filter(
                    function () {

                        const time =
                            $(this)
                                .attr(
                                    "data-arrival"
                                );


                        return (
                            time >= "20:30"
                            &&
                            time <= "21:00"
                        );

                    }
                );


        case 8:

            return $(
                ".guest-card"
            )
                .not(
                    ".aitu"
                )
                .filter(
                    function () {

                        return (
                            $(this)
                                .attr(
                                    "data-arrival"
                                )
                            >
                            "21:00"
                        );

                    }
                );


        case 9:

            return $(
                '.guest-card[data-name="Askar"]'
            )
                .prev(
                    ".guest-card"
                )
                .add(
                    $(
                        '.guest-card[data-name="Askar"]'
                    )
                        .next(
                            ".guest-card"
                        )
                );


        case 10:

            return $(
                ".guest-list "
                +
                ".guest-card:last-child"
            );


        case 11:

            return $(
                ".guest-list "
                +
                ".guest-card:nth-child(3)"
            );


        case 12:

            return $(
                '.guest-card[data-name="Timur"]'
            )
                .nextAll(
                    ".guest-card"
                );


        case 13:

            return $(
                ".guest-card.color-black"
            )
                .prev(
                    ".guest-card"
                );


        case 14:

            return $(
                '.guest-card[data-name="Aruzhan"]'
            )
                .closest(
                    ".room"
                );


        case 15:

            return $(
                ".room"
            )
                .filter(
                    function () {

                        return (
                            $(this)
                                .find(
                                    ".guest-card"
                                )
                                .length
                            <
                            6
                        );

                    }
                );


        case 16:

            return $(
                ".room:has(.has-cup)"
                +
                ":not(:has(.has-glasses))"
            );


        case 17:

            return $(
                ".guest-card"
            )
                .filter(
                    function () {

                        const $card =
                            $(this);


                        const ownTime =
                            $card.attr(
                                "data-arrival"
                            );


                        const firstTime =
                            $card
                                .closest(
                                    ".room"
                                )
                                .find(
                                    ".guest-card"
                                )
                                .map(
                                    function () {

                                        return $(this)
                                            .attr(
                                                "data-arrival"
                                            );

                                    }
                                )
                                .get()
                                .sort()[0];


                        return (
                            ownTime
                            ===
                            firstTime
                        );

                    }
                );


        case 20:

            return $(
                '.floor[data-floor="1"] '
                +
                ".guest-card"
                +
                ".has-crumbs"
                +
                ":not(.has-cup)"
            )
                .filter(
                    function () {

                        const time =
                            $(this)
                                .attr(
                                    "data-arrival"
                                );


                        return (
                            time > "21:00"
                            &&
                            time < "21:30"
                        );

                    }
                )
                .filter(
                    function () {

                        return (

                            $(this)
                                .prev(
                                    ".guest-card.aitu"
                                )
                                .length
                            >
                            0

                            ||

                            $(this)
                                .next(
                                    ".guest-card.aitu"
                                )
                                .length
                            >
                            0

                        );

                    }
                );

    }


    return $();

}



/* ---------------------------------
   CASE 18
--------------------------------- */

function runCase18() {

    const miras = {

        name: "Miras",
        color: "blue",
        arrival: "21:20",
        aitu: true,
        things: ["phone"]

    };


    const $miras =
        createGuestCard(
            miras
        )
            .hide()
            .insertAfter(
                $(
                    '.guest-card[data-name="Askar"]'
                )
            );


    $(".guest-card")
        .not(
            $miras
        )
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            0.2
        );


    $miras
        .fadeIn(
            500,

            function () {

                $(this)
                    .addClass(
                        "found"
                    )
                    .fadeTo(
                        0,
                        1
                    );


                jumpGuests(
                    $(this)
                );


                updateRoomCounts();

            }
        );


    $("#resultText")
        .text(
            "Miras joined the Living room between Askar and Inkar."
        );

}



/* ---------------------------------
   CASE 19
--------------------------------- */

function runCase19() {

    const $natasha =
        $(
            '.guest-card[data-name="Natasha"]'
        );


    $(".guest-card")
        .not(
            $natasha
        )
        .stop(
            true,
            true
        )
        .fadeTo(
            300,
            0.2
        );


    $natasha
        .stop(
            true,
            true
        )
        .fadeTo(
            0,
            1
        )
        .addClass(
            "found"
        );


    $natasha
        .fadeOut(
            500,

            function () {

                $(this)
                    .remove();


                updateRoomCounts();

            }
        );


    $("#resultText")
        .text(
            "Natasha went home."
        );

}



/* ---------------------------------
   RUN CASE
--------------------------------- */

function runCase(
    caseNumber
) {

    closeGuestCardImmediately();


    /*
        Assignment requirement:
        rebuild before every case
    */

    buildParty();


    clearHighlights();


    $("#chainOutput")
        .text(
            caseChains[
                caseNumber
            ]
        );


    if (
        caseNumber === 18
    ) {

        runCase18();

        return;

    }


    if (
        caseNumber === 19
    ) {

        runCase19();

        return;

    }


    const $result =
        getCaseResult(
            caseNumber
        );


    if (
        caseNumber >= 14
        &&
        caseNumber <= 16
    ) {

        showRoomResults(
            $result
        );

    } else {

        showGuestResults(
            $result
        );

    }

}



/* ---------------------------------
   GUEST THINGS AS WORDS
--------------------------------- */

function thingsToWords(
    things
) {

    if (
        things.length === 0
    ) {

        return (
            "Came with nothing."
        );

    }


    return (
        "Has "
        +
        things.join(", ")
        +
        "."
    );

}



/* ---------------------------------
   MOVE BUTTONS
--------------------------------- */

function buildMoveButtons(
    guestName,
    currentRoomName
) {

    $("#moveButtons")
        .empty();


    $("#moveButtons")
        .append(

            $("<p>")
                .addClass(
                    "move-title"
                )
                .text(
                    "Move guest:"
                )

        );


    $.each(
        rooms,

        function (
            index,
            room
        ) {

            if (
                room.name
                ===
                currentRoomName
            ) {

                return;

            }


            const $button =
                $("<button>")
                    .attr(
                        "type",
                        "button"
                    )
                    .addClass(
                        "move-button"
                    )
                    .attr(
                        "data-guest",
                        guestName
                    )
                    .attr(
                        "data-target-room",
                        room.name
                    )
                    .text(
                        "Move to "
                        +
                        room.name
                    );


            $("#moveButtons")
                .append(
                    $button
                );

        }
    );

}



/* ---------------------------------
   OPEN GUEST CARD
--------------------------------- */

function openGuestCard(
    $guestCard
) {

    const guestName =
        $guestCard.attr(
            "data-name"
        );


    const location =
        findGuestLocation(
            guestName
        );


    if (!location) {

        return;

    }


    /*
        If another guest is open,
        close it first.
    */

    if (
        activeGuestName
        &&
        activeGuestName !== guestName
    ) {

        closeGuestCard(
            function () {

                openGuestCard(
                    $guestCard
                );

            }
        );

        return;

    }


    activeGuestName =
        guestName;


    const guest =
        location.guest;


    $("#guestModalBody")
        .empty();


    const $avatar =
        $("<img>")
            .addClass(
                "guest-detail-avatar"
            )
            .attr(
                "src",
                "https://api.dicebear.com/9.x/open-peeps/svg?seed="
                +
                encodeURIComponent(
                    guest.name
                )
            )
            .attr(
                "alt",
                guest.name
            );


    $("#guestModalBody")
        .append(

            $avatar,

            $("<h2>")
                .attr(
                    "id",
                    "guestModalTitle"
                )
                .text(
                    guest.name
                ),

            $("<p>")
                .addClass(
                    "guest-info"
                )
                .text(
                    "Room: "
                    +
                    location.room.name
                ),

            $("<p>")
                .addClass(
                    "guest-info"
                )
                .text(
                    "Clothing color: "
                    +
                    guest.color
                ),

            $("<p>")
                .addClass(
                    "guest-info"
                )
                .text(
                    "Came at "
                    +
                    guest.arrival
                ),

            $("<p>")
                .addClass(
                    "guest-info"
                )
                .text(
                    guest.aitu
                        ?
                        "AITU student"
                        :
                        "Not an AITU student"
                ),

            $("<p>")
                .addClass(
                    "guest-info"
                )
                .text(
                    thingsToWords(
                        guest.things
                    )
                )

        );


    buildMoveButtons(
        guestName,
        location.room.name
    );


    /*
        Starting position:
        guest's avatar.
    */

    const avatarOffset =
        $guestCard
            .find(
                ".avatar-ring"
            )
            .offset();


    const startLeft =
        avatarOffset.left
        -
        $(window)
            .scrollLeft();


    const startTop =
        avatarOffset.top
        -
        $(window)
            .scrollTop();


    const targetWidth =
        Math.min(
            360,
            window.innerWidth - 32
        );


    const targetHeight =
        Math.min(
            430,
            window.innerHeight - 32
        );


    const targetLeft =
        Math.max(
            16,

            (
                window.innerWidth
                -
                targetWidth
            )
            /
            2
        );


    const targetTop =
        Math.max(
            16,

            (
                window.innerHeight
                -
                targetHeight
            )
            /
            2
        );


    $("#guestOverlay")
        .stop(
            true,
            true
        )
        .fadeIn(
            150
        );


    $("#guestModal")
        .stop(
            true,
            true
        )
        .css({

            display:
                "block",

            left:
                startLeft,

            top:
                startTop,

            width:
                62,

            height:
                62,

            opacity:
                0.2

        })
        .animate(
            {

                left:
                    targetLeft,

                top:
                    targetTop,

                width:
                    targetWidth,

                height:
                    targetHeight,

                opacity:
                    1

            },

            350
        );

}



/* ---------------------------------
   CLOSE GUEST CARD
--------------------------------- */

function closeGuestCard(
    callback
) {

    if (
        !activeGuestName
    ) {

        if (callback) {

            callback();

        }

        return;

    }


    const $source =
        $(
            '.guest-card[data-name="'
            +
            activeGuestName
            +
            '"] .avatar-ring'
        );


    let targetLeft = 16;

    let targetTop = 16;


    if (
        $source.length > 0
    ) {

        const offset =
            $source.offset();


        targetLeft =
            offset.left
            -
            $(window)
                .scrollLeft();


        targetTop =
            offset.top
            -
            $(window)
                .scrollTop();

    }


    $("#guestModal")
        .stop(
            true,
            true
        )
        .animate(
            {

                left:
                    targetLeft,

                top:
                    targetTop,

                width:
                    62,

                height:
                    62,

                opacity:
                    0

            },

            300,

            function () {

                $(this)
                    .hide();


                $("#guestOverlay")
                    .stop(
                        true,
                        true
                    )
                    .fadeOut(
                        150
                    );


                activeGuestName =
                    null;


                if (callback) {

                    callback();

                }

            }
        );

}



/* ---------------------------------
   CLOSE IMMEDIATELY
--------------------------------- */

function closeGuestCardImmediately() {

    $("#guestModal")
        .stop(
            true,
            true
        )
        .hide();


    $("#guestOverlay")
        .stop(
            true,
            true
        )
        .hide();


    activeGuestName =
        null;

}



/* ---------------------------------
   UPDATE ROOM COUNTERS
--------------------------------- */

function updateRoomCounts() {

    $(".room")
        .each(
            function () {

                const count =
                    $(this)
                        .find(
                            ".guest-card"
                        )
                        .length;


                $(this)
                    .find(
                        ".room-count"
                    )
                    .text(
                        count
                    );

            }
        );

}



/* ---------------------------------
   MOVE GUEST
--------------------------------- */

function moveGuest(
    guestName,
    targetRoomName
) {

    /*
        Prevent repeated move clicks.
    */

    if (
        moveInProgress
    ) {

        return;

    }


    const location =
        findGuestLocation(
            guestName
        );


    const targetRoom =
        findRoom(
            targetRoomName
        );


    if (
        !location
        ||
        !targetRoom
        ||
        location.room.name
        ===
        targetRoomName
    ) {

        return;

    }


    moveInProgress =
        true;


    const guest =
        location.guest;


    const $card =
        $(
            '.guest-card[data-name="'
            +
            guestName
            +
            '"]'
        );


    const $targetList =
        $(
            '.room[data-room="'
            +
            targetRoomName
            +
            '"] .guest-list'
        );


    if (
        $card.length === 0
        ||
        $targetList.length === 0
    ) {

        moveInProgress =
            false;

        return;

    }


    const sourceOffset =
        $card.offset();


    const targetOffset =
        $targetList.offset();


    /*
        Clone card for flight.
    */

    const $flyingCard =
        $card
            .clone()
            .addClass(
                "flying-card"
            )
            .css({

                left:
                    sourceOffset.left
                    -
                    $(window)
                        .scrollLeft(),

                top:
                    sourceOffset.top
                    -
                    $(window)
                        .scrollTop(),

                width:
                    $card.outerWidth(),

                opacity:
                    1

            })
            .appendTo(
                "body"
            );


    /*
        Close old space slowly.
    */

    $card
        .stop(
            true,
            true
        )
        .slideUp(
            350,

            function () {

                $(this)
                    .remove();

            }
        );


    /*
        Fly across house.
    */

    $flyingCard
        .stop(
            true,
            true
        )
        .animate(
            {

                left:
                    targetOffset.left
                    -
                    $(window)
                        .scrollLeft(),

                top:
                    targetOffset.top
                    -
                    $(window)
                        .scrollTop()

            },

            600,

            function () {

                $(this)
                    .remove();


                /*
                    IMPORTANT:
                    update JavaScript array.
                */

                location
                    .room
                    .guests
                    .splice(
                        location.index,
                        1
                    );


                targetRoom
                    .guests
                    .push(
                        guest
                    );


                /*
                    Update original room orders.
                */

                location
                    .room
                    .originalOrder =
                    location
                        .room
                        .originalOrder
                        .filter(
                            function (
                                name
                            ) {

                                return (
                                    name
                                    !==
                                    guestName
                                );

                            }
                        );


                targetRoom
                    .originalOrder
                    .push(
                        guestName
                    );


                location.room.sorted =
                    false;


                targetRoom.sorted =
                    false;


                /*
                    Create new card
                    in target room.
                */

                const $newCard =
                    createGuestCard(
                        guest
                    )
                        .hide();


                $targetList
                    .append(
                        $newCard
                    );


                /*
                    New space opens slowly.
                */

                $newCard
                    .stop(
                        true,
                        true
                    )
                    .slideDown(
                        350,

                        function () {

                            updateRoomCounts();


                            moveInProgress =
                                false;

                        }
                    );

            }
        );

}



/* ---------------------------------
   SORT ROOM
--------------------------------- */

function sortRoom(
    roomName
) {

    const room =
        findRoom(
            roomName
        );


    if (!room) {

        return;

    }


    const $list =
        $(
            '.room[data-room="'
            +
            roomName
            +
            '"] .guest-list'
        );


    const $cards =
        $list.find(
            ".guest-card"
        );


    /*
        Fast click protection.
    */

    $cards.stop(
        true,
        true
    );


    /*
        Remember old positions.
    */

    const oldPositions =
        {};


    $cards.each(
        function () {

            oldPositions[
                $(this)
                    .attr(
                        "data-name"
                    )
            ] =
                $(this)
                    .offset();

        }
    );


    /*
        Toggle:
        sorted / picture order
    */

    room.sorted =
        !room.sorted;


    let orderedNames;


    if (
        room.sorted
    ) {

        orderedNames =
            room.guests
                .slice()
                .sort(
                    function (
                        a,
                        b
                    ) {

                        return (
                            a.arrival
                                .localeCompare(
                                    b.arrival
                                )
                        );

                    }
                )
                .map(
                    function (
                        guest
                    ) {

                        return guest.name;

                    }
                );

    } else {

        orderedNames =
            room
                .originalOrder
                .slice();

    }


    /*
        Reorder DOM.
    */

    $.each(
        orderedNames,

        function (
            index,
            name
        ) {

            $list.append(

                $list.find(
                    '.guest-card[data-name="'
                    +
                    name
                    +
                    '"]'
                )

            );

        }
    );


    /*
        Animate cards
        from old position
        to new position.
    */

    $list
        .find(
            ".guest-card"
        )
        .each(
            function () {

                const $card =
                    $(this);


                const name =
                    $card.attr(
                        "data-name"
                    );


                const newPosition =
                    $card.offset();


                const oldPosition =
                    oldPositions[
                        name
                    ];


                if (!oldPosition) {

                    return;

                }


                $card
                    .css({

                        position:
                            "relative",

                        left:
                            oldPosition.left
                            -
                            newPosition.left,

                        top:
                            oldPosition.top
                            -
                            newPosition.top

                    })
                    .stop(
                        true,
                        true
                    )
                    .animate(
                        {

                            left:
                                0,

                            top:
                                0

                        },

                        500
                    );

            }
        );

}



/* ---------------------------------
   RESET PARTY
--------------------------------- */

function resetParty() {

    closeGuestCardImmediately();


    rooms =
        cloneInitialRooms();


    moveInProgress =
        false;


    buildParty();


    $("#resultText")
        .text(
            "Party reset."
        );


    $("#chainOutput")
        .text(
            "—"
        );

}



/* ---------------------------------
   EVENTS
--------------------------------- */

$(function () {

    buildCaseButtons();

    buildParty();


    /*
        Allows the page behind
        the dark overlay to receive clicks.
        This lets another guest be clicked.
    */

    $("#guestOverlay")
        .css(
            "pointer-events",
            "none"
        );


    $("#guestModal")
        .css(
            "pointer-events",
            "auto"
        );


    /*
        CASE BUTTONS
    */

    $("#caseButtons")
        .on(
            "click",
            ".case-button",

            function () {

                const caseNumber =
                    Number(
                        $(this)
                            .attr(
                                "data-case"
                            )
                    );


                runCase(
                    caseNumber
                );

            }
        );


    /*
        CLEAR
    */

    $("#clearButton")
        .on(
            "click",
            clearSpotlight
        );


    /*
        RESET PARTY
    */

    $("#resetButton")
        .on(
            "click",
            resetParty
        );


    /*
        CLICK GUEST
    */

    $("#party")
        .on(
            "click",
            ".guest-card",

            function (event) {

                event.stopPropagation();


                openGuestCard(
                    $(this)
                );

            }
        );


    /*
        SORT ROOM
    */

    $("#party")
        .on(
            "click",
            ".sort-room",

            function (event) {

                event.stopPropagation();


                const roomName =
                    $(this)
                        .attr(
                            "data-room"
                        );


                sortRoom(
                    roomName
                );

            }
        );


    /*
        CLOSE BUTTON
    */

    $("#closeGuestCard")
        .on(
            "click",

            function (event) {

                event.stopPropagation();


                closeGuestCard();

            }
        );


    /*
        MOVE BUTTON
    */

    $("#moveButtons")
        .on(
            "click",
            ".move-button",

            function (event) {

                event.stopPropagation();


                const guestName =
                    $(this)
                        .attr(
                            "data-guest"
                        );


                const targetRoom =
                    $(this)
                        .attr(
                            "data-target-room"
                        );


                closeGuestCard(
                    function () {

                        moveGuest(
                            guestName,
                            targetRoom
                        );

                    }
                );

            }
        );


    /*
        ESC CLOSE
    */

    $(document)
        .on(
            "keydown",

            function (event) {

                if (
                    event.key
                    ===
                    "Escape"
                ) {

                    closeGuestCard();

                }

            }
        );


    /*
        CLICK OUTSIDE MODAL
    */

    $(document)
        .on(
            "click",

            function (event) {

                if (
                    !activeGuestName
                ) {

                    return;

                }


                const clickedInsideModal =
                    $(event.target)
                        .closest(
                            "#guestModal"
                        )
                        .length
                    >
                    0;


                const clickedGuest =
                    $(event.target)
                        .closest(
                            ".guest-card"
                        )
                        .length
                    >
                    0;


                if (
                    !clickedInsideModal
                    &&
                    !clickedGuest
                ) {

                    closeGuestCard();

                }

            }
        );

});