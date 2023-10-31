import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      de: {
        translation: {
            theories:{
              darkgreen:"Schlüsselbegriffe der aktuellen Bildungsforschung",
              darkgreen_desc:"Einblicke in die aktuellen wissenschaftlichen und zukunftsrelevanten Diskurse der Bildungsforschung ermöglichen Dir eine Orientierung und einen Umgang mit den theoretischen Inhalten Deines Studiums.",
              blue:"Forschungsansätze für guten Unterricht",
              blue_desc:"Als angehende Lehrkraft ist es für Dich wichtig zu wissen, wodurch sich eigentlich guter Unterricht auszeichnet. Durch Forschungsansätze der Unterrichtsqualität wirst Du mit Methoden und Möglichkeiten vertraut gemacht, worauf es in der Unterrichtsplanung und -durchführung ankommt.",
              yellow:"Erfassung von Unterrichtsqualität",
              yellow_desc:"Die professionelle Wahrnehmung des eigenen Unterrichts ist stetig zu fördern, um angemessene  Schlussfolgerungen für das eigene pädagogische und unterrichtliche Handeln ziehen zu können. Feedback- und Beobachtungsmethoden zur Analyse und Qualitätsverbesserung von Unterricht sind hierbei wichtig.",
              violet:"Lernen mit und durch Medien",
              violet_desc:"Eine mediengeprägte Umwelt der Schüler*innen bietet sowohl Herausforderungen aber vor allem auch Chancen für den eigenen Unterricht. Zum Umgang mit der digitalen Kultur ist eine medienpädagogische und in einigen Kontexten sogar informatische Bildung notwendig. ",
              rose:"Heterogenität und Inklusion",
              rose_desc:"Wie du als angehende Lehrkraft mit den verschiedenen Bedürfnissen und Fähigkeiten deiner Schüler*innen umgehst, ist ein wichtiger Bereich Deines Studiums. ",
              green:"Classroom Management",
              green_desc:"Wie sorge ich für ein positives und produktives Klima im Klassenzimmer? Wie erkenne ich, ob meine Schüler*innen interessiert sind? Wie gehe ich mit Störungen im Unterricht um? Wie Du als angehende Lehrkraft eine geeignete Lehr-Lern-Atmosphäre schaffst, hängt unter anderem von den vielfältigen Umweltbedingungen des Lernens ab. ",
              grey:"Grundlagen des Lehramtstudiums",
              grey_desc:"Die Grundlagen des Lehramtstudiums bestimmen unter anderem die Studieninhalte und die Lehrauffassung in der Lehrkräftebildung. Mit den grundlegenden Begriffen und Institutionen vertraut zu sein, ist somit ein Teil der kritischen Auseinandersetzung mit dem eigenen Studium.",
              orange:"Kompetenzen und ihre Schulung",
              orange_desc:"Was ist eigentlich der Unterschied zwischen Kompetenz und Fähigkeit? Wie messe und bewerte ich eigentlich Leistungen? Was sind meine Lernziele im Unterricht? Als angehende Lehrkraft musst Du all diese Fragen in Deine Unterrichtsvorbereitung einbeziehen können."
            },

            alert: {
              negative_cards_first:"Du kannst '{0}' nicht spielen, du muss zuerst negative Karten spielen ('{1}')",
              not_enough_time_plural:'Du hast nicht genug Zeit um "{0}" zu erlernen. Dir fehlen {1} Zeitpunkte. Klicke eines der anderen Karten an, um sie in Zeitpunkte umzuwandeln.',
              not_enough_time_singular:'Du hast nicht genug Zeit um "{0}" zu erlernen. Dir fehlt 1 Zeitpunkt. Klicke eines der anderen Karten an, um sie in Zeitpunkte umzuwandeln.',
            },
            npcBar: {
              tooltip_no_card:"Keine Karte",
              tooltip_timecard:"Karte {0} as Zeit verwendet."
            },
            ms: {
              praktika:"Praktikum",
              praktika_desc:"Das Schulpraktikum dient der Berufsfelderkundung. Du begleitet Lehrkräfte an einer Schule, darfst selbst unterrichten und so einen Einblick in den Arbeitsalltag einer Lehrkraft im Spannungsfeld von Unterricht, Erziehung und außerunterrichtlichen Arbeitsfeldern erfahren. ",
              bachelor:"Bachelor",
              bachelor_desc:"Beim Bachelorstudium besuchst du mehrere Lehrveranstaltungen, wie zum Beispiel Übungen, Vorlesungen oder Seminare. Du erwirbst Fachwissen, fachdidaktisches Wissen und Lehrinhalte z. B. in der allgemeinen Pädagogik, der Schulpädagogik und der Psychologie. Am Ende schreibst du eine Bachelorarbeit. ",
              master:"Master",
              master_desc:"Mit dem Master sind der Antritt des Referendariats und die Ablegung des Zweiten Staatsexamens möglich. Dein im Studium erlerntes Wissen und Deine bislang geförderten Kompetenzen und Fähigkeiten werden weiter ausgebaut. Mit dem Zweiten Staatsexamen kann dann die Übernahme in den Schuldienst erfolgen.",
              praxis:"Praxis",
              praxis_desc:"Im Praxissemester besuchst Du Module, die z. B. Deinen Umgang mit Inklusion und Heterogenität fördern und Du erlernst spezielle fachdidaktische und pädagogischen Inhalte die dich auf das Masterpraktikum vorbereiten. In dem Praktikum lernst Du den Schulalltag gründlich kennen und setzt dich mit den vielfältigen Aufgaben einer Lehrkraft über einen längeren Zeitraum praktisch und intensiv auseinander. ",
            },
            common: {

              empowerment:"Empowerment",
              empowerment_tooltip:"Dein Empowerment, also Deine eigenen Einstellungen und Überzeugungen, lässt Dich umso unerschütterlicher werden, desto fundierter und gesicherter es ist. Bist Du Dir Deiner Sache bewusst und von ihr überzeugt, lässt Du dich nicht so schnell von ihr abbringen.",
              experience:"Erfahrung",
              experience_tooltip:"Die Erfahrung ist neben einem guten Theoriewissen ein wichtiger Bestandteil der Lehrkräfteausbildung. Erst wenn Du selber vor einer Klasse stehst, wirst du merken, wie gut du das Erlernte umsetzen kannst und wie viel Spaß Dir der Umgang mit den Schüler*innen macht. Und vor allem wirst Du merken, dass vieles mit wachsender Erfahrung auch zunehmend leichter wird.",
              knowledge:"Wissen",
              knowledge_tooltip:"Das Wissen hat viele Gesichter. Von auswendiggelernten Fachbegriffen bis zum Verständnis von komplexen Theorien bereitet dich ein fundiertes Wissen in deinen Fächern, der Pädagogik und den Didaktiken auf deine spätere Lehrtätigkeit vor.",
              motivation:"Motivation",
              motivation_tooltip:"Die Motivation ist eine der wichtigsten Voraussetzungen des erfolgreichen Lernens und des Durchhaltevermögens. Auch, wenn es mal schwieriger werden sollte, können sowohl äußere Faktoren wie Erfolgserlebnisse im Studium, als auch innere Faktoren, wie Dein Interesse an deinen Fächern oder der Lehre [ODER: wie dein Wunsch Lehrkraft zu werden], deine Motivation positiv beeinflussen.",
            },
            npcs : {
                npc1_name:"Juliane",
                npc1_desc:"Juliane ist auf dem Weg, eine Mathe-Zauberin zu werden. Zahlen und Formeln haben vor ihr keine Chance!",
                npc1_image:"female_1.png",

                npc2_name:"Dominik",
                npc2_desc:"Dominik ist der Meister des Kunstgeschichten-Kabaretts. Kunstwerke werden unter seinem Einfluss zu Stand-up-Comedy!",
                npc2_image:"male_1.png",

                npc3_name:"Katharina",
                npc3_desc:"Katharina ist wie eine Superheldin des Ehrgeizes. Sie stürzt sich in Herausforderungen mit Entschlossenheit und einer Prise Mut, die ihresgleichen sucht!",
                npc3_image:"female_2.png",

                npc4_name:"Heinrich",
                npc4_desc:"Heinrichs exzentrischer Geschmack und sein unkonventioneller Stil machen ihn zum Trendsetter unter seinen Kommilitonen.",
                npc4_image:"male_2.png",

                npc5_name:"Melanie",
                npc5_desc:"Melanie ist wie ein wandelndes Wikipedia. Sie hat Antwort auf alles und verteilt Wissen wie Konfetti!",
                npc5_image:"female_3.png",
            },
            highscore: {
              stats_time:"Spielzeit",
              stats_rounds:"Runden gespielt",
              stats_theories:"Theorien erlernt",
              stats_events:"An Ereignissen teilgenommen",
              stats_events_created:"Ereignisse initiiert",

              you:"Du",
              player:"Mitspieler*innen",
              milestone:"Meilenstein",
              score:"Punkte",
              stats:"Deine Statistiken",
              lose_title:"Du hast verloren.",
              lose_desc:"Leider waren Andere diesmal schneller als Du. Aber keine Sorge, im richtigen Studium kommt es nicht ausschließlich auf die Schnelligkeit an. Probiere es nochmal und vielleicht kannst Du Dich ja in der nächsten Runde steigern.",
              win_title:"Du hast gewonnen",
              win_desc:"Sehr gut, du hast alle Meilensteine erreicht und die meisten Punkte bekommen.",
            },
            logs: {
              empty_hand:"Du hast keine Karten mehr auf der Hand. Klicke auf den Play-Button um die Runde zu beenden.",
              event_question:"Möchtest du am Ereignis '{0}' teilnehmen?",
              participate:"Teilnehmen",
              decline:"Nein",
              game_started:"Das Spiel hat begonnen, viel Erfolg!",
              game_won_user:"Du hast das Spiel gewonnen!",
              game_won_npc:"{0} hat das Spiel gewonnen!",
              finish_round_user:"Du hast die Runde beendet.",
              finish_round_npc:"{0} hat die Runde beendet.",
              fill_hand_user:"Du bist an der Reihe und hast neue Karten bekommen.",
              fill_hand_npc:"{0} hat neue Karten bekommen.",
              negative_event_user:"Du musstest '{0}' erfahren.",
              negative_event_npc:"{0} musste '{1}' erfahren.",
              theory_learned_user:"Du hast die Theorie '{0}' erlernt.",
              theory_learned_npc:"{0} hat die Theorie '{1}' erlernt.",
              event_participated_user:"Du hast am Ereignis '{0}' teilgenommen.",
              event_participated_npc:"{0} hat am Ereignis '{1}' teilgenommen.",
              milestone_reached_user:"Du hast einen Meilenstein erreicht: {0}",
              milestone_reached_npc:"{0} hat einen Meilenstein erreicht: {1}",
              backup_user:"Du hast die Karte '{0}' als Zeitvorrat gespeichert. ",
              backup_npc:"{0} hat die Karte '{1}' als Zeitvorrat gespeichert. ",
            },
            intro : {
                title:"Willkommen bei Caula - dem digitalen Spiel des Lehramts ",
                select_player_title:"Wähle deine Mitspieler*innen",
                start_button:"Start",

                tooltips: {
                  npc_locked:"Dieser Spieler ist gesperrt. Du kannst ihn freischalten, wenn du im Spiel deinen Masterabschluss mit den meisten Punkten machst.",
                }
            }
        }
      }
    }
  });

export default i18n;