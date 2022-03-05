(function createCards() {
    (function init() {
        let cardsRow = document.getElementById("cardsRow");
        let cardsModals = document.getElementById("cardsModals");
        const cards = getCards().reverse();

        cards.forEach(card => {
            const color = getColor(card.kcal);
            const modalId = card.imgSrc.split(".")[0];

            createCard(cardsRow, card, color, modalId);
            createModal(cardsModals, card, color, modalId);
        });
    })();

    function getColor(kcal) {
        if (kcal < 500) {
            return "success";
        } else if (kcal < 700) {
            return "warning";
        }

        return "danger";
    }

    function createCard(cardsRow, card, color, modalId) {
        let colDiv = document.createElement("DIV");
        colDiv.setAttribute("class", "col mb-4");

        let cardDiv = document.createElement("DIV");
        cardDiv.setAttribute("class", "card border-" + color);

        let imgDiv = document.createElement("IMG");
        imgDiv.setAttribute("src", "src/img/food/" + card.imgSrc);
        imgDiv.setAttribute("class", "cardImg card-img-top");
        imgDiv.setAttribute("alt", "...");

        let cardBodyDiv = document.createElement("DIV");
        cardBodyDiv.setAttribute("class", "card-body");

        let cardBodyH5 = document.createElement("H5");
        cardBodyH5.setAttribute("class", "card-title");
        cardBodyH5.textContent = card.title + " ";

        let cardBodyText;
        let tags = card.tags;
        if (tags && tags.length > 0) {
            cardBodyText = document.createElement("P");
            cardBodyText.setAttribute("class", "card-text");

            let parsedTags = [];
            tags.forEach(tag => {
                if (tag == 0) {
                    parsedTags.push("Śniadanie");
                } else if (tag == 1) {
                    parsedTags.push("Obiad");
                } else if (tag == 2) {
                    parsedTags.push("Kolacje");
                } else if (tag == 3) {
                    parsedTags.push("Przekąske");
                }
            });

            cardBodyText.textContent = "Dobre na: " + parsedTags.join(', ');
        }

        let cardBodyButton = document.createElement("BUTTON");
        cardBodyButton.setAttribute("type", "button");
        cardBodyButton.setAttribute("class", "btn btn-outline-" + color);
        cardBodyButton.setAttribute("data-toggle", "modal");
        cardBodyButton.setAttribute("data-target", "#modal" + modalId);
        cardBodyButton.textContent = "Przepis";

        let cardFooterText = "Porcja ma " + card.kcal + " kcal, przepis na " + card.servingsNumber + " ";

        if (card.servingsNumber >= 1 && card.servingsNumber <= 4) {
            cardFooterText += "porcje";
        } else if (card.servingsNumber > 5) {
            cardFooterText += "porcji";
        }

        let cardFooterDiv = document.createElement("DIV");
        cardFooterDiv.setAttribute("class", "card-footer bg-" + color + " text-white");
        cardFooterDiv.textContent = cardFooterText;

        cardDiv.appendChild(imgDiv);
        cardDiv.appendChild(cardBodyDiv);
        cardBodyH5.appendChild(getKindIcon(card.kind, color));
        cardBodyDiv.appendChild(cardBodyH5);

        if (cardBodyText) {
            cardBodyDiv.appendChild(cardBodyText);
        }

        cardBodyDiv.appendChild(cardBodyButton);
        cardDiv.appendChild(cardFooterDiv);
        colDiv.appendChild(cardDiv);
        cardsRow.appendChild(colDiv);
    }

    function getKindIcon(kind, color) {
        let classValue = "fa ";

        if (kind == 0) {
            classValue += "fa-birthday-cake ";
        } else if (kind == 1) {
            classValue += "fa-cutlery ";
        }

        if (color == "success") {
            classValue += "green";
        } else if (color == "warning") {
            classValue += "yellow";
        } else if (color == "danger") {
            classValue += "red";
        }

        let cardBodyI = document.createElement("I");
        cardBodyI.setAttribute("class", classValue);
        cardBodyI.setAttribute("aria-hidden", "true");

        return cardBodyI;
    }

    function createModal(cardsModals, card, color, modalId) {
        let modalLabelId = "modal" + modalId + "Label";

        let modalDiv = document.createElement("DIV");
        modalDiv.setAttribute("class", "modal fade");
        modalDiv.setAttribute("id", "modal" + modalId);
        modalDiv.setAttribute("tabindex", "-1");
        modalDiv.setAttribute("role", "dialog");
        modalDiv.setAttribute("aria-labelledby", modalLabelId);
        modalDiv.setAttribute("aria-hidden", "true");

        let modalDialogDiv = document.createElement("DIV");
        modalDialogDiv.setAttribute("class", "modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg");
        modalDialogDiv.setAttribute("role", "document");

        let modalContentDiv = document.createElement("DIV");
        modalContentDiv.setAttribute("class", "modal-content");

        let modalHeaderDiv = document.createElement("DIV");
        modalHeaderDiv.setAttribute("class", "modal-header");

        let modalTitleH5 = document.createElement("H5");
        modalTitleH5.setAttribute("class", "modal-title");
        modalTitleH5.setAttribute("id", modalLabelId);
        modalTitleH5.textContent = card.title;

        let modalHeaderButton = document.createElement("BUTTON");
        modalHeaderButton.setAttribute("type", "button");
        modalHeaderButton.setAttribute("class", "close");
        modalHeaderButton.setAttribute("data-dismiss", "modal");
        modalHeaderButton.setAttribute("aria-label", "Close");

        let modalHeaderButtonSpan = document.createElement("SPAN");
        modalHeaderButtonSpan.setAttribute("aria-hidden", "true");
        modalHeaderButtonSpan.textContent = "x";

        let modalBodyDiv = document.createElement("DIV");
        modalBodyDiv.setAttribute("class", "modal-body");

        let modalListGroupUl = document.createElement("UL");
        modalListGroupUl.setAttribute("class", "list-group list-group-flush");

        card.products.forEach(product => {
            let listElementLi = document.createElement("UL");
            listElementLi.setAttribute("class", "list-group-item");
            listElementLi.textContent = product;

            modalListGroupUl.appendChild(listElementLi);
        });

        let additionalInformationText
        if (card.tutorial.additionalInformation) {
            additionalInformationText = document.createElement("P");
            additionalInformationText.setAttribute("class", "text-center font-weight-bold");
            additionalInformationText.textContent = card.tutorial.additionalInformation;
        }

        let modalFooterDiv = document.createElement("DIV");
        modalFooterDiv.setAttribute("class", "modal-footer");

        let modalFooterAClass = "btn btn-block btn-" + color;
        let modalFooterATextContent = "Otwórz przepis";
        let href = "";
        let isModalFooterAEnabled = !!card.tutorial && card.tutorial != "";

        if (!isModalFooterAEnabled) {
            modalFooterAClass += " disabled";
            modalFooterATextContent = "Brak przepisu";
        } else {
            if (card.tutorial.href) {
                href = card.tutorial.href;
            } else if (card.tutorial.image) {
                href = "./src/img/tutorial/" + card.tutorial.image;
            }
        }

        let modalFooterA = document.createElement("A");
        modalFooterA.setAttribute("target", "_blank");
        modalFooterA.setAttribute("href", href);
        modalFooterA.setAttribute("class", modalFooterAClass);
        modalFooterA.setAttribute("role", "button");
        modalFooterA.setAttribute("aria-pressed", "true");

        modalFooterA.textContent = modalFooterATextContent;

        modalHeaderDiv.appendChild(modalTitleH5);
        modalHeaderDiv.appendChild(modalHeaderButton);
        modalHeaderButton.appendChild(modalHeaderButtonSpan);
        modalContentDiv.appendChild(modalHeaderDiv);
        modalBodyDiv.appendChild(modalListGroupUl);
        if(additionalInformationText){
            modalBodyDiv.appendChild(additionalInformationText);
        }
        modalContentDiv.appendChild(modalBodyDiv);
        modalFooterDiv.appendChild(modalFooterA);
        modalContentDiv.appendChild(modalFooterDiv);
        modalDialogDiv.appendChild(modalContentDiv);
        modalDiv.appendChild(modalDialogDiv);
        cardsModals.appendChild(modalDiv);
    }
})();