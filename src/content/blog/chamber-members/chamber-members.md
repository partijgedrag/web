---
title: Wie zijn de 150 Belgische parlementsleden?
subtitle: Een kijkje in De Kamer. Wie zijn de 150 kamerleden?
description: Een kijkje in De Kamer. Wie zijn de 150 kamerleden, hoe oud zijn ze en van welke fracties maken ze deel uit?
date: 2026-06-30
---

De Belgische Kamer van Volksvertegenwoordigers telt **{{ members.members | filter("active", "true") | length }} leden**. Zij vertegenwoordigen de Belgische bevolking en beslissen mee over alle federale wetgeving: van begrotingen tot pensioenen, van justitie tot mobiliteit. Maar wie zijn deze 150 mensen eigenlijk? In dit artikel werpen we een blik op de samenstelling van de Kamer: hun leeftijd, hun fracties en hoe divers (of net niet) deze groep eigenlijk is.

## Hoeveel fracties zetelen er in de Kamer?

De 150 zetels zijn verdeeld over **{{ members.members | map("fraction") | unique | length }} fracties**. Elke fractie vertegenwoordigt een politieke partij of een samenwerkingsverband van partijen, en weerspiegelt zo de verschillende stromingen binnen de Belgische politiek — van Vlaamse en Franstalige partijen tot kleinere fracties die toch een stevige stem laten horen in het halfrond.

Deze versnippering is typisch Belgisch: in tegenstelling tot landen met een tweepartijenstelsel, moet hier vaak een brede coalitie van meerdere partijen worden gevormd om een meerderheid te behalen.

## De jongste en oudste kamerleden

Leeftijd zegt veel over wie er in het halfrond zit. Op dit moment is **{{ (members.members | youngest).first_name }} {{ (members.members | youngest).last_name }}** met **{{ (members.members | youngest).date_of_birth | age }} jaar** het jongste lid van de Kamer. Aan de andere kant van het spectrum vinden we **{{ (members.members | oldest).first_name }} {{ (members.members | oldest).last_name }}**, die op **{{ (members.members | oldest).date_of_birth | age }} jaar** het oudste actieve kamerlid is.
        
Dat leeftijdsverschil illustreert mooi hoe breed de waaier aan ervaring en perspectief in de Kamer is: van politici die net hun eerste mandaat opstarten tot gevestigde waarden met decennia aan ervaring.

<div class="bento">
    <div class="card padded flex-col gap-small bento-item-1">
        <h2>{{ members.members | filter("active", "true") | length }}</h2>
        <p data-i18n="chamberMembers">chamberMembers</p>
    </div>
    <div class="card padded flex-col gap-small bento-item-1">
        <h2>{{ members.members | map("fraction") | unique | length }}</h2>
        <p data-i18n="fractions">fractions</p>
    </div>
    <div class="card padded flex-col gap-small bento-item-1">
        <h2>{{ (members.members | youngest).date_of_birth | age }}
            <span data-i18n="age">jaar</span>
        </h2>
        <p>{{ (members.members | youngest).first_name }}
            {{ (members.members | youngest).last_name }},
            <span data-i18n="youngestMember">jongste lid</span>
        </p>
    </div>
    <div class="card padded flex-col gap-small bento-item-1">
        <h2>{{ (members.members | oldest).date_of_birth | age }}
            <span data-i18n="age">jaar</span>
        </h2>
        <p>{{ (members.members | oldest).first_name }}
            {{ (members.members | oldest).last_name }},
            <span data-i18n="oldestMember">oudste lid</span>
        </p>
    </div>
     <div class="card padded flex-col gap-small bento-item-2">
        <h3 style="margin-top: 0; margin-bottom: 0.4rem;" class="capitalize" data-i18n="ageDistributionTitle">Leeftijdverdeling</h3>
        <p data-i18n="ageDistributionDescription">Wat is de leeftijdsverdeling van de kamerleden?</p>
        <svg id="ageHistogram" style="margin-top: 1rem;"></svg>
    </div>
</div>

Wanneer we naar de volledige leeftijdsverdeling van alle 150 leden kijken, valt op dat de meeste parlementsleden zich in de middenleeftijd bevinden, eerder dan aan de uiteinden van het spectrum. Dit is een patroon dat je in veel parlementen terugziet: politieke ervaring en netwerken opbouwen kost tijd, waardoor jongere kandidaten het vaak moeilijker hebben om door te breken, terwijl een mandaat op hogere leeftijd minder evident wordt.

## Meer dan een naam en een leeftijd

Achter elk van deze 150 namen schuilt een verhaal: een kieskring, een partij, en vooral een stemgedrag. Op partijgedrag.be kan je niet alleen ontdekken wie de kamerleden zijn, maar ook hoe zij stemmen, hoe vaak ze aanwezig zijn bij stemmingen, en in welke mate ze de lijn van hun partij volgen.

Wil je een specifiek kamerlid opzoeken, filteren op fractie of kieskring, of gewoon eens rondsnuffelen? Bezoek de volledige [ledenpagina](/members/) en ontdek wie jouw volksvertegenwoordigers écht zijn.

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        const ages = {{ members.ages | dump | safe }}; // This is how you access the ages array
        const membersTranslation = "kamerLeden";
        const ageRangeTranslation = "leeftijdsVerdeling";
        // Setup dimensions and margins
        const margin = {
            top: 5,
            right: 0,
            bottom: 30,
            left: 30
        };
        const container = document.getElementById("ageHistogram").parentNode;
        const width = container.clientWidth - margin.left - margin.right;
        const height = 150;
        const svg = d3
            .select("#ageHistogram")
            .attr(
                "viewBox",
                `0 0 ${
                    width + margin.left + margin.right
                } ${
                    height + margin.top + margin.bottom
                }`
            )
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%")
            .style("height", "auto");
        const g = svg.append("g").attr("transform", `translate(${
            margin.left
        },${
            margin.top
        })`);
        // Create bins
        const binGenerator = d3
            .bin()
            .domain([20, 85]) // Adjust as needed
            .thresholds(10); // 10 bins
        const bins = binGenerator(ages);
        // Scales
        const y = d3
            .scaleLinear()
            .domain([
                0, d3.max(bins, d => d.length) + 5
            ])
            .range([height, 0]); // IMPORTANT: bottom (0) to top (max)
        const color = d3
            .scaleLinear()
            .domain([
                0, d3.max(bins, d => d.length)
            ])
            .range(["#cce5ff", "#004085"]);
        // Axes
        const x = d3
            .scaleBand()
            .domain(bins.map(d => d.x0)) // Use bin start (x0) for the domain
            .range([0, width])
            .padding(0.1); // Adjust the padding between bars Add the x-axis with ticks at the start of each bin
        g
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                .axisBottom(x)
                .tickValues(bins.map(d => d.x0)) // Place ticks at the start of each bin
                .tickFormat(d => `${d}`) // Show ticks as bin ranges (e.g., 30, 35)
            )
            .call(g => g.select(".domain").remove()) // Remove axis line
            .call(g => g
                .selectAll("text")
                .style("font-size", "0.75rem")
                .style("fill", "#333"));
        // Tooltip setup
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        // Add the y-axis with grid lines
        g
            .append("g")
            .call(
                d3
                .axisLeft(y)
                .ticks(10)
                .tickSize(- width) // Draw grid lines across the chart
                .tickFormat(d => d) // optional, in case you want to format
            )
            .call(g => g.select(".domain").remove()) // Remove the vertical axis line
            .call(
                g => g
                .selectAll("text")
                .style("font-size", "0.75rem")
                .style("font-family", "sans-serif")
                .style("fill", "#333")
            )
            .call(
                g => g
                .selectAll(".tick line")
                .attr("stroke", "#ddd") // Light grey lines
                .attr("stroke-dasharray", "2,2") // Optional dashed lines
            );
        // Create the bars with correct positioning and width
        const bars = g
            .selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.x0) + x.bandwidth() * 0.5)
            .attr("width", x.bandwidth())
            .attr("y", y(0)) // Start from bottom
            .attr("height", 0) // No height at start
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("fill", d => color(d.length));
        bars
            .transition()
            .duration(800)
            .attr("y", d => y(d.length)) // Move upward
            .attr("height", d => height - y(d.length)); // Stretch from bottom up Tooltip functionality
        bars.on("mouseover", function (event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 1);
            tooltip
                .html(`<strong>${
                    d.length
                }</strong> ${membersTranslation}<br/>${ageRangeTranslation}: ${
                    d.x0
                } - ${
                    d.x1 - 1
                }`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");
            d3.select(this).attr("fill", "#0056b3");
        }).on("mouseout", function (event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
            d3.select(this).attr("fill", color(d.length)); // Correct reference to `d` here
        }); // Event handler should work now
    });
</script>
