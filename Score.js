function showAboutModal() {
            document.getElementById('about-modal').classList.add('show');
        }
        function hideAboutModal() {
            document.getElementById('about-modal').classList.remove('show');
        }
        function showSourcesModal() {
            document.getElementById('sources-modal').classList.add('show');
        }
        function hideSourcesModal() {
            document.getElementById('sources-modal').classList.remove('show');
        }
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') hideSourcesModal();
        });
        document.addEventListener('click', function(event) {
            if (event.target && event.target.id === 'sources-modal') hideSourcesModal();
        });


        function openAdvancedNEWS2() {
            var content = document.querySelector('.content-wrap');
            var adv = document.getElementById('advanced-news2-page');
            var nav = document.getElementById('main-nav');
            if (content) content.classList.add('hidden');
            if (nav) nav.classList.add('hidden');
            if (adv) adv.classList.remove('hidden');
            var footer = document.querySelector('.score-footer');
            if (footer) footer.classList.add('hidden');
            if (typeof updateHeaderByCategory === 'function') updateHeaderByCategory('triage');
            window.scrollTo(0, 0);
            calculateAdvancedNEWS2();
        }

        function closeAdvancedNEWS2() {
            var content = document.querySelector('.content-wrap');
            var adv = document.getElementById('advanced-news2-page');
            var nav = document.getElementById('main-nav');
            if (adv) adv.classList.add('hidden');
            if (content) content.classList.remove('hidden');
            if (nav) nav.classList.remove('hidden');
            var footer = document.querySelector('.score-footer');
            if (footer) footer.classList.remove('hidden');
            window.scrollTo(0, 0);
        }

        function updateAdvancedChoiceStyles() {
            var rows = document.querySelectorAll('.advanced-table tbody tr');
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].querySelectorAll('.advanced-radio');
                for (var j = 0; j < cells.length; j++) {
                    cells[j].classList.remove('is-yes', 'is-no');
                    var input = cells[j].querySelector('input[type="radio"]');
                    if (!input || !input.checked) continue;
                    cells[j].classList.add(input.value === 'ja' ? 'is-yes' : 'is-no');
                }
            }
        }

        
        function selectAdvancedCell(cell) {
            var input = cell ? cell.querySelector('input[type="radio"]') : null;
            if (input) {
                input.checked = true;
                updateAdvancedChoiceStyles();
                calculateAdvancedNEWS2();
            }
        }

        function calculateAdvancedNEWS2() {
            var names = ['adv_q1','adv_q2','adv_q3','adv_q4','adv_q5'];
            var answered = 0;
            var anyYes = false;
            for (var i=0; i<names.length; i++) {
                var checked = document.querySelector('input[name="' + names[i] + '"]:checked');
                if (checked) {
                    answered++;
                    if (checked.value === 'ja') anyYes = true;
                }
            }
            var result = document.getElementById('advanced-news2-result');
            if (!result) return;
            result.className = 'advanced-result';
            updateAdvancedChoiceStyles();
            var copyBtn = document.getElementById('advanced-copy-result-btn');
            if (copyBtn) copyBtn.classList.add('hidden');
            advancedNEWS2InfoGiven = false;
            advancedNEWS2InfoLang = '';
            if (answered < names.length) {
                result.textContent = 'Svar på alle spørsmålene.';
                return;
            }
            if (!anyYes) {
                result.className = 'advanced-result good';
                result.innerHTML = '<strong>Alle spørsmål er besvart med "nei" og pasienten kan dra hjem med infoskriv.</strong>' +
                    '<div class="info-links">' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'no\')">Norsk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'en\')">Engelsk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'de\')">Tysk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'pl\')">Polsk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'fr\')">Fransk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'es\')">Spansk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'ar\')">Arabisk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'zh\')">Kinesisk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'uk\')">Ukrainsk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'pt\')">Portugisisk</button>' +
                    '<button type="button" class="info-link" onclick="showPatientSheet(\'ja\')">Japansk</button>' +
                    '</div>' +
                    '<button id="advanced-copy-result-btn" type="button" class="copy-btn advanced-copy-result hidden" onclick="copyAdvancedNEWS2Result()">Kopier resultat</button>';
            } else {
                result.className = 'advanced-result warn';
                result.innerHTML = '<strong>Minst ett spørsmål er besvart med ja.</strong><br>Pasienten bør ikke sendes hjem kun basert på grønn NEWS2. Vurder videre klinisk avklaring.';
            }
        }

        function isNEWS2CompleteForAdvanced() {
            var ids = ['n2_resp','n2_spo2','n2_bp','n2_puls','n2_temp'];
            for (var i = 0; i < ids.length; i++) {
                var el = document.getElementById(ids[i]);
                if (!el || el.value === '' || isNaN(parseFloat(el.value.replace(',', '.')))) return false;
            }
            return !!document.querySelector('input[name="n2_o2"]:checked') &&
                   !!document.querySelector('input[name="n2_avpu"]:checked');
        }

        function updateAdvancedNEWS2Button(score) {
            var btn = document.getElementById('advanced-news2-btn');
            if (!btn) return;
            var numericScore = parseFloat(score);
            if (currentTab === 'news2' && isNEWS2CompleteForAdvanced() && !isNaN(numericScore) && numericScore === 0) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        }

        var patientSheets = {
            "no": "Kjære pasient!\n\nVår medarbeider har vurdert at det er trygt at du kan dra hjem og se det an. Vurderingen er basert på dine helseopplysninger og undersøkelsene som er gjort av deg.\n\nVi forventer at dine plager vil gå over av seg selv, men vi kan aldri garantere det. Derfor er det viktig at du tar kontakt med fastlege i kontortiden (mandag–fredag 09–15), dersom tilstanden din forverres og du trenger hjelp.\n\nHvis du ikke har fastlege, eller det er utenom kontortid, skal du kontakte legevakten i den kommunen du oppholder deg for hjelp, 116117.\n\nVennlig hilsen\n\nBergen legevakt",
            "en": "Dear patient!\n\nOur staff has assessed that it is safe for you to go home and monitor your condition. This assessment is based on your medical information and the examinations that have been carried out.\n\nWe expect that your symptoms will resolve on their own, but we can never guarantee this. Therefore, it is important that you contact your general practitioner (\"fastlege\") during office hours (Monday–Friday, 9:00 a.m.–3:00 p.m.) if your condition worsens and you need assistance.\n\nIf you do not have a general practitioner, or if it is outside office hours, you should contact the emergency medical clinic (out-of-hours service) in the municipality where you are staying for help, 116117.\n\nKind regards\n\nBergen legevakt",
            "de": "Liebe Patientin, lieber Patient!\n\nUnsere Mitarbeiterin / unser Mitarbeiter hat beurteilt, dass Sie sicher nach Hause gehen und Ihren Zustand beobachten können. Diese Beurteilung basiert auf Ihren Gesundheitsangaben und den durchgeführten Untersuchungen.\n\nWir erwarten, dass Ihre Beschwerden von selbst abklingen, können dies jedoch niemals garantieren. Deshalb ist es wichtig, dass Sie sich während der Sprechzeiten (Montag–Freitag, 09:00–15:00 Uhr) an Ihre Hausärztin / Ihren Hausarzt wenden, wenn sich Ihr Zustand verschlechtert und Sie Hilfe benötigen.\n\nWenn Sie keine Hausärztin / keinen Hausarzt haben oder es außerhalb der Sprechzeiten ist, wenden Sie sich bitte an den ärztlichen Bereitschaftsdienst in der Gemeinde, in der Sie sich aufhalten, unter 116117.\n\nMit freundlichen Grüßen\n\nBergen legevakt",
            "pl": "Szanowna Pacjentko, Szanowny Pacjencie!\n\nNasz pracownik ocenił, że możesz bezpiecznie wrócić do domu i obserwować swój stan. Ocena ta opiera się na podanych przez Ciebie informacjach medycznych oraz wykonanych badaniach.\n\nSpodziewamy się, że dolegliwości ustąpią samoistnie, ale nigdy nie możemy tego zagwarantować. Dlatego ważne jest, aby skontaktować się z lekarzem rodzinnym w godzinach pracy przychodni (poniedziałek–piątek, 09:00–15:00), jeśli Twój stan się pogorszy i będziesz potrzebować pomocy.\n\nJeśli nie masz lekarza rodzinnego albo jest poza godzinami pracy przychodni, skontaktuj się z legevaktą w gminie, w której przebywasz, pod numerem 116117.\n\nZ poważaniem\n\nBergen legevakt",
            "fr": "Cher patient, chère patiente !\n\nNotre personnel a évalué qu’il est sûr pour vous de rentrer chez vous et de surveiller l’évolution de votre état. Cette évaluation repose sur vos informations médicales et les examens réalisés.\n\nNous pensons que vos symptômes disparaîtront d’eux-mêmes, mais nous ne pouvons jamais le garantir. Il est donc important de contacter votre médecin traitant pendant les heures d’ouverture (du lundi au vendredi, de 09 h à 15 h) si votre état s’aggrave et si vous avez besoin d’aide.\n\nSi vous n’avez pas de médecin traitant, ou si vous êtes en dehors des heures d’ouverture, vous devez contacter le service médical de garde de la commune où vous vous trouvez au 116117.\n\nCordialement\n\nBergen legevakt",
            "es": "Estimado/a paciente:\n\nNuestro personal ha valorado que es seguro que usted vuelva a casa y observe la evolución de su estado. Esta valoración se basa en la información médica que ha proporcionado y en los exámenes realizados.\n\nEsperamos que sus molestias desaparezcan por sí solas, pero nunca podemos garantizarlo. Por eso es importante que contacte con su médico de cabecera durante el horario de consulta (lunes a viernes, 09:00–15:00) si su estado empeora y necesita ayuda.\n\nSi no tiene médico de cabecera, o si está fuera del horario de consulta, debe contactar con el servicio de urgencias médicas de la municipalidad en la que se encuentre, llamando al 116117.\n\nAtentamente\n\nBergen legevakt"
        };
        var currentPatientSheet = 'no';
        patientSheets.no = "Kjære pasient!\n\nVår medarbeider har vurdert at det er trygt at du kan dra hjem og se det an. Vurderingen er basert på dine helseopplysninger og undersøkelsene som er gjort av deg.\n\nVi forventer at dine plager vil gå over av seg selv, men vi kan aldri garantere det. Derfor er det viktig at du tar kontakt med fastlege i kontortiden (mandag–fredag 09:00–15:00), dersom tilstanden din forverres og du trenger hjelp.\n\nHvis du ikke har fastlege, eller det er utenom kontortid, skal du kontakte legevakten i den kommunen du oppholder deg i for hjelp, 116117.\n\nVennlig hilsen\n\nBergen legevakt";
        patientSheets.en = "Dear patient!\n\nOur staff has assessed that it is safe for you to go home and monitor your condition. This assessment is based on your medical information and the examinations that have been carried out.\n\nWe expect that your symptoms will resolve on their own, but we can never guarantee this. Therefore, it is important that you contact your general practitioner during office hours (Monday–Friday, 09:00–15:00) if your condition worsens and you need assistance.\n\nIf you do not have a general practitioner, or if it is outside office hours, you should contact the emergency medical clinic in the municipality where you are staying for help, 116117.\n\nKind regards\n\nBergen legevakt";
        patientSheets.de = "Liebe Patientin, lieber Patient!\n\nUnsere Mitarbeiterin oder unser Mitarbeiter hat beurteilt, dass Sie sicher nach Hause gehen und Ihren Zustand beobachten können. Diese Beurteilung basiert auf Ihren Gesundheitsangaben und den durchgeführten Untersuchungen.\n\nWir erwarten, dass Ihre Beschwerden von selbst abklingen, können dies jedoch niemals garantieren. Deshalb ist es wichtig, dass Sie sich während der Sprechzeiten (Montag–Freitag, 09:00–15:00 Uhr) an Ihre Hausärztin oder Ihren Hausarzt wenden, wenn sich Ihr Zustand verschlechtert und Sie Hilfe benötigen.\n\nWenn Sie keine Hausärztin oder keinen Hausarzt haben oder es außerhalb der Sprechzeiten ist, wenden Sie sich bitte an den ärztlichen Bereitschaftsdienst in der Gemeinde, in der Sie sich aufhalten, unter 116117.\n\nMit freundlichen Grüßen\n\nBergen legevakt";
        patientSheets.pl = "Szanowna Pacjentko, Szanowny Pacjencie!\n\nNasz pracownik ocenił, że możesz bezpiecznie wrócić do domu i obserwować swój stan. Ocena ta opiera się na podanych przez Ciebie informacjach medycznych oraz wykonanych badaniach.\n\nSpodziewamy się, że dolegliwości ustąpią samoistnie, ale nigdy nie możemy tego zagwarantować. Dlatego ważne jest, aby skontaktować się z lekarzem rodzinnym w godzinach pracy przychodni (poniedziałek–piątek, 09:00–15:00), jeśli Twój stan się pogorszy i będziesz potrzebować pomocy.\n\nJeśli nie masz lekarza rodzinnego albo jest poza godzinami pracy przychodni, skontaktuj się z legevaktą w gminie, w której przebywasz, pod numerem 116117.\n\nZ poważaniem\n\nBergen legevakt";
        patientSheets.fr = "Cher patient, chère patiente !\n\nNotre personnel a évalué qu’il est sûr pour vous de rentrer chez vous et de surveiller l’évolution de votre état. Cette évaluation repose sur vos informations médicales et les examens réalisés.\n\nNous pensons que vos symptômes disparaîtront d’eux-mêmes, mais nous ne pouvons jamais le garantir. Il est donc important de contacter votre médecin traitant pendant les heures d’ouverture (du lundi au vendredi, de 09:00 à 15:00) si votre état s’aggrave et si vous avez besoin d’aide.\n\nSi vous n’avez pas de médecin traitant, ou si vous êtes en dehors des heures d’ouverture, vous devez contacter le service médical de garde de la commune où vous vous trouvez au 116117.\n\nCordialement\n\nBergen legevakt";
        patientSheets.es = "Estimado/a paciente:\n\nNuestro personal ha valorado que es seguro que usted vuelva a casa y observe la evolución de su estado. Esta valoración se basa en la información médica que ha proporcionado y en los exámenes realizados.\n\nEsperamos que sus molestias desaparezcan por sí solas, pero nunca podemos garantizarlo. Por eso es importante que contacte con su médico de cabecera durante el horario de consulta (lunes a viernes, 09:00–15:00) si su estado empeora y necesita ayuda.\n\nSi no tiene médico de cabecera, o si está fuera del horario de consulta, debe contactar con el servicio de urgencias médicas de la municipalidad en la que se encuentre, llamando al 116117.\n\nAtentamente\n\nBergen legevakt";
        patientSheets.ar = "عزيزي المريض / عزيزتي المريضة،\n\nلقد قيّم طاقمنا أنه من الآمن أن تعود إلى المنزل وتراقب حالتك. يستند هذا التقييم إلى معلوماتك الطبية والفحوصات التي أُجريت لك.\n\nنتوقع أن تتحسن الأعراض من تلقاء نفسها، لكننا لا نستطيع ضمان ذلك أبداً. لذلك من المهم أن تتواصل مع طبيبك العام خلال ساعات العمل (من الاثنين إلى الجمعة، من 09:00 إلى 15:00) إذا ساءت حالتك واحتجت إلى المساعدة.\n\nإذا لم يكن لديك طبيب عام، أو كان ذلك خارج ساعات العمل، فعليك الاتصال بخدمة الطوارئ الطبية في البلدية التي تقيم فيها على الرقم 116117.\n\nمع خالص التحية\n\nBergen legevakt";
        patientSheets.zh = "亲爱的患者：\n\n我们的工作人员评估后认为，您目前可以安全回家并自行观察病情。该评估基于您的健康信息以及已经为您完成的检查。\n\n我们预计您的不适会自行缓解，但这点无法完全保证。因此，如果您的情况加重并需要帮助，请您在工作时间内（周一至周五 09:00–15:00）联系您的家庭医生。\n\n如果您没有家庭医生，或当前不在工作时间内，请联系您所在市镇的急诊医疗服务，电话 116117。\n\n此致敬礼\n\nBergen legevakt";
        patientSheets.uk = "Шановний пацієнте / Шановна пацієнтко!\n\nНаш працівник оцінив, що для вас безпечно повернутися додому та спостерігати за своїм станом. Ця оцінка ґрунтується на ваших медичних даних і проведених обстеженнях.\n\nМи очікуємо, що ваші симптоми минуть самостійно, але ніколи не можемо цього гарантувати. Тому важливо звернутися до сімейного лікаря в години роботи (понеділок–п’ятниця, 09:00–15:00), якщо ваш стан погіршиться і вам буде потрібна допомога.\n\nЯкщо у вас немає сімейного лікаря або це поза робочим часом, зверніться до служби невідкладної медичної допомоги в муніципалітеті, де ви перебуваєте, за номером 116117.\n\nЗ повагою\n\nBergen legevakt";
        patientSheets.pt = "Caro/a paciente,\n\nA nossa equipa avaliou que é seguro que volte para casa e observe a evolução do seu estado. Esta avaliação baseia-se nas suas informações médicas e nos exames realizados.\n\nEsperamos que os seus sintomas melhorem por si só, mas nunca o podemos garantir. Por isso, é importante contactar o seu médico de família durante o horário de atendimento (segunda a sexta-feira, 09:00–15:00) se o seu estado piorar e precisar de ajuda.\n\nSe não tiver médico de família, ou se estiver fora do horário de atendimento, deverá contactar o serviço médico de urgência do município onde se encontra, através do número 116117.\n\nCom os melhores cumprimentos\n\nBergen legevakt";
        patientSheets.ja = "患者さまへ\n\n当院スタッフは、現時点でご帰宅のうえ経過をご自身でみていただいて安全であると判断しました。この判断は、あなたの健康情報と実施した診察・検査にもとづいています。\n\n症状は自然に改善することが期待されますが、必ずそうなるとは限りません。状態が悪化したり支援が必要になった場合は、診療時間内（月曜日から金曜日 09:00–15:00）にかかりつけ医へ連絡してください。\n\nかかりつけ医がいない場合、または診療時間外の場合は、滞在している自治体の救急医療サービスへ 116117 で連絡してください。\n\n敬具\n\nBergen legevakt";
        var patientSheetLogo = "data:image/png;base64,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";

        function getPatientSheetDateTime() {
            var now = new Date();
            function pad(n) { return (n < 10 ? '0' : '') + n; }
            return pad(now.getDate()) + "." + pad(now.getMonth() + 1) + "." + now.getFullYear() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
        }

        function buildPatientSheetHtml(lang) {
            var txt = patientSheets[lang || 'no'] || '';
return '<img class="patient-letter-logo" src="' + patientSheetLogo + '" alt="Bergen kommune - Bergen legevakt">' +
                   '<div class="patient-letter-date">' + getPatientSheetDateTime() + '</div>' +
                   '<div class="patient-letter-body">' + txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>';
        }

        function getPatientSheetTitle(lang) {
            var titles = {
                no: 'Infoskriv',
                en: 'Patient information',
                de: 'Patienteninformation',
                pl: 'Informacja dla pacjenta',
                fr: 'Information patient',
                es: 'Información para el paciente',
                ar: 'معلومات للمريض',
                zh: '患者须知',
                uk: 'Інформація для пацієнта',
                pt: 'Informação para o paciente',
                ja: '患者向け情報'
            };
            return titles[lang || 'no'] || titles.no;
        }

        function showPatientSheet(lang) {
            currentPatientSheet = lang || 'no';
            var toolSelect = document.getElementById('tool-patient-sheet-lang');
            if (toolSelect) toolSelect.value = currentPatientSheet;
            document.getElementById('patient-sheet-title').textContent = getPatientSheetTitle(currentPatientSheet);
            document.getElementById('patient-sheet-body').innerHTML =
                buildPatientSheetHtml(currentPatientSheet);
            document.getElementById('patient-sheet-modal').classList.add('show');
        }

        function closePatientSheet() {
            document.getElementById('patient-sheet-modal').classList.remove('show');
        }

        
        var advancedNEWS2InfoGiven = false;
        var advancedNEWS2InfoLang = '';

        function getAdvancedAnswerText(name) {
            var checked = document.querySelector('input[name="' + name + '"]:checked');
            if (!checked) return 'Ikke utfylt';
            return checked.value === 'ja' ? 'Ja' : 'Nei';
        }

        function getAdvancedLangName(lang) {
            var map = { no: 'Norsk', en: 'Engelsk', de: 'Tysk', pl: 'Polsk', fr: 'Fransk', es: 'Spansk', ar: 'Arabisk', zh: 'Kinesisk', uk: 'Ukrainsk', pt: 'Portugisisk', ja: 'Japansk' };
            return map[lang] || lang || 'Ikke valgt';
        }

        function showAdvancedCopyResultButton() {
            var btn = document.getElementById('advanced-copy-result-btn');
            if (btn) btn.classList.remove('hidden');
        }

        function finishAdvancedNEWS2Copy() {
            closePatientSheet();
            closeAdvancedNEWS2();
            switchTab('news2');
            resetForm(true);
            showToast('Resultat kopiert til utklippstavlen!');
            setTimeout(function() {
                var firstInput = document.getElementById('n2_resp');
                if (firstInput) firstInput.focus();
            }, 30);
        }

        function copyAdvancedNEWS2Result() {
            var now = new Date();
            function pad(n) { return (n < 10 ? '0' : '') + n; }
            var dt = pad(now.getDate()) + "." + pad(now.getMonth() + 1) + "." + now.getFullYear() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
            var text = "[Avansert hastegradvurdering] - " + dt + "\n";
            text += "NEWS2 grønn. Supplerende vurdering gjennomført.\n\n";
            text += "Svar:\n";
            text += "- Bruker pasienten faste medisiner: " + getAdvancedAnswerText('adv_q1') + "\n";
            text += "- Nylig kontakt med helsepersonell om aktuell problemstilling: " + getAdvancedAnswerText('adv_q2') + "\n";
            text += "- Pasienten er ikke/har ikke risikofaktorer i liste 1: " + getAdvancedAnswerText('adv_q3') + "\n";
            text += "- Pasienten har/er risikofaktorer i liste 2: " + getAdvancedAnswerText('adv_q4') + "\n";
            text += "- Usikker på hjemreise / ønsker legevurdering: " + getAdvancedAnswerText('adv_q5') + "\n\n";
            text += advancedNEWS2InfoGiven ? (getPatientSheetTitle(advancedNEWS2InfoLang) + " gitt/skrevet ut på: " + getAdvancedLangName(advancedNEWS2InfoLang) + "\n") : "Infoskriv ikke registrert skrevet ut.\n";
            text += "Konklusjon: Pasienten er anbefalt å dra hjem med infoskriv, da alle spørsmål er besvart med nei.";
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function(){ finishAdvancedNEWS2Copy(); });
            } else {
                fallbackCopyTextToClipboard(text);
                finishAdvancedNEWS2Copy();
            }
        }

        function printPatientSheet() {
            var sheetHtml = buildPatientSheetHtml(currentPatientSheet);
            var title = getPatientSheetTitle(currentPatientSheet);
            var iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.setAttribute('aria-hidden', 'true');
            document.body.appendChild(iframe);

            var doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument;
            if (!doc) {
                document.body.removeChild(iframe);
                if (typeof showToast === 'function') showToast('Kunne ikke starte utskrift', true);
                return;
            }

            closePatientSheet();
            advancedNEWS2InfoGiven = true;
            advancedNEWS2InfoLang = currentPatientSheet;
            showAdvancedCopyResultButton();

            doc.open();
            doc.write('<html><head><meta charset="UTF-8"><title>' + title + '</title><style>body{font-family:Arial,sans-serif;padding:2rem;line-height:1.6;font-size:14pt;color:#111827}.patient-letter-logo{display:block;width:190px;max-width:70%;margin:0 auto 1.5rem auto}.patient-letter-date{text-align:right;margin-bottom:1.5rem;color:#374151}.patient-letter-body{white-space:pre-wrap}</style></head><body>' + sheetHtml + '</body></html>');
            doc.close();

            var printed = false;
            function cleanup() {
                setTimeout(function() {
                    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                }, 500);
            }
            function printWhenReady() {
                if (printed) return;
                printed = true;
                var win = iframe.contentWindow;
                if (!win) {
                    cleanup();
                    return;
                }
                if ('onafterprint' in win) win.onafterprint = cleanup;
                win.focus();
                win.print();
                cleanup();
            }

            var logo = doc.querySelector('.patient-letter-logo');
            if (logo && !logo.complete) {
                logo.addEventListener('load', printWhenReady, { once: true });
                logo.addEventListener('error', printWhenReady, { once: true });
                setTimeout(printWhenReady, 1200);
            } else {
                setTimeout(printWhenReady, 80);
            }
        }


        


        // Logikk (State)
        var currentTab = 'news2';
        var currentCategory = null;
        var currentScoreComplete = false;
        var currentRegistrationCopied = false;
        var settingsCookieDays = 365;
        var defaultSettings = {
            homePage: 'main',
            textSize: 'base',
            darkMode: '0',
            hideScoreInfo: '0'
        };

        // Arrays med sjekklister
        var qSofaData = [
            { text: "Respirasjonsfrekvens ≥ 22 /min", val: 1 },
            { text: "Endret mental status (f.eks. GCS < 15, forvirring)", val: 1 },
            { text: "Systolisk blodtrykk ≤ 100 mmHg", val: 1 }
        ];

        var chadsData = [
            { text: "Hjertesvikt", val: 1 },
            { text: "Hypertensjon", val: 1 },
            { text: "Diabetes mellitus", val: 1 },
            { text: "Tidligere hjerneslag / TIA / tromboembolisme", val: 2 },
            { text: "Vaskulær sykdom (Tidligere hjerteinfarkt, perifer arteriesykdom, aorta-plakk)", val: 1 }
        ];

        var wellsDVTData = [
            { text: "Aktiv kreft (behandling innen 6 mnd, eller palliasjon)", val: 1 },
            { text: "Paralyse, parese eller nylig gipsing av underekstremitet", val: 1 },
            { text: "Nylig sengeliggende > 3 dager, eller stor kirurgi < 12 uker", val: 1 },
            { text: "Lokal ømhet langs dype vener", val: 1 },
            { text: "Hele beinet er hovent", val: 1 },
            { text: "Legg > 3 cm større enn asymptomatisk side (målt 10 cm under tuberositas tibiae)", val: 1 },
            { text: "Pittingødem kun i symptomatisk bein", val: 1 },
            { text: "Kollaterale overfladiske vener (ikke varicer)", val: 1 },
            { text: "Tidligere dokumentert DVT", val: 1 },
            { text: "Alternativ diagnose minst like sannsynlig som DVT", val: -2 }
        ];

        var wellsLEData = [
            { text: "Kliniske tegn og symptomer på DVT", val: 3 },
            { text: "Alternativ diagnose er mindre sannsynlig enn lungeemboli", val: 3 },
            { text: "Puls > 100 slag/min", val: 1.5 },
            { text: "Immobilisering (>3 dager) eller kirurgi siste 4 uker", val: 1.5 },
            { text: "Tidligere påvist DVT/LE", val: 1.5 },
            { text: "Hemoptyse", val: 1 },
            { text: "Malignitet (behandling siste 6 mnd eller palliasjon)", val: 1 }
        ];

        var curb65Data = [
            { text: "Konfusjon", val: 1 },
            { text: "Respirasjonsfrekvens ≥ 30 /min", val: 1 },
            { text: "Systolisk BT < 90 eller diastolisk BT ≤ 60 mmHg", val: 1 },
            { text: "Alder ≥ 65 år", val: 1 }
        ];

        var abcd2Data = [
            { text: "Alder ≥ 60 år", val: 1 },
            { text: "BT ≥ 140 systolisk eller ≥ 90 diastolisk", val: 1 },
            { text: "Klinikk: unilateral svakhet", val: 2 },
            { text: "Klinikk: talevansker uten svakhet", val: 1 },
            { text: "Varighet ≥ 60 minutter", val: 2 },
            { text: "Varighet 10-59 minutter", val: 1 },
            { text: "Diabetes", val: 1 }
        ];

        var mantrelData = [
            { text: "Migrasjon av smerter til høyre fossa iliaca", val: 1 },
            { text: "Anoreksi", val: 1 },
            { text: "Kvalme eller oppkast", val: 1 },
            { text: "Ømhet i høyre fossa iliaca", val: 2 },
            { text: "Slippømhet", val: 1 },
            { text: "Temperaturforhøyelse / feber", val: 1 },
            { text: "Leukocytose", val: 2 },
            { text: "Venstreforskyvning / nøytrofili", val: 1 }
        ];

        var nihssData = [
            { id:"nihss_1a", title:"1a Bevissthetsnivå", options:[{v:0,t:"0 - Våken"},{v:1,t:"1 - Ikke helt våken"},{v:2,t:"2 - Somnolent/stuporøs"},{v:3,t:"3 - Koma"}]},
            { id:"nihss_1b", title:"1b Orientering", options:[{v:0,t:"0 - Begge riktige"},{v:1,t:"1 - Ett riktig"},{v:2,t:"2 - Ingen riktige"}]},
            { id:"nihss_1c", title:"1c Kommandoer", options:[{v:0,t:"0 - Begge utføres"},{v:1,t:"1 - Én utføres"},{v:2,t:"2 - Ingen utføres"}]},
            { id:"nihss_2", title:"2 Blikk", options:[{v:0,t:"0 - Normalt"},{v:1,t:"1 - Delvis blikkparese"},{v:2,t:"2 - Tvungen deviasjon"}]},
            { id:"nihss_3", title:"3 Synsfelt", options:[{v:0,t:"0 - Normalt"},{v:1,t:"1 - Delvis hemianopsi"},{v:2,t:"2 - Komplett hemianopsi"},{v:3,t:"3 - Bilateral blindhet"}]},
            { id:"nihss_4", title:"4 Facialisparese", options:[{v:0,t:"0 - Normal"},{v:1,t:"1 - Lett"},{v:2,t:"2 - Delvis"},{v:3,t:"3 - Komplett"}]},
            { id:"nihss_5a", title:"5a Motorikk venstre arm", options:[{v:0,t:"0 - Ingen drift"},{v:1,t:"1 - Drift"},{v:2,t:"2 - Noe mot tyngde"},{v:3,t:"3 - Ingen mot tyngde"},{v:4,t:"4 - Ingen bevegelse"}]},
            { id:"nihss_5b", title:"5b Motorikk høyre arm", options:[{v:0,t:"0 - Ingen drift"},{v:1,t:"1 - Drift"},{v:2,t:"2 - Noe mot tyngde"},{v:3,t:"3 - Ingen mot tyngde"},{v:4,t:"4 - Ingen bevegelse"}]},
            { id:"nihss_6a", title:"6a Motorikk venstre bein", options:[{v:0,t:"0 - Ingen drift"},{v:1,t:"1 - Drift"},{v:2,t:"2 - Noe mot tyngde"},{v:3,t:"3 - Ingen mot tyngde"},{v:4,t:"4 - Ingen bevegelse"}]},
            { id:"nihss_6b", title:"6b Motorikk høyre bein", options:[{v:0,t:"0 - Ingen drift"},{v:1,t:"1 - Drift"},{v:2,t:"2 - Noe mot tyngde"},{v:3,t:"3 - Ingen mot tyngde"},{v:4,t:"4 - Ingen bevegelse"}]},
            { id:"nihss_7", title:"7 Ataksi", options:[{v:0,t:"0 - Ingen"},{v:1,t:"1 - Ett ekstremitet"},{v:2,t:"2 - To ekstremiteter"}]},
            { id:"nihss_8", title:"8 Sensibilitet", options:[{v:0,t:"0 - Normal"},{v:1,t:"1 - Lett/moderat tap"},{v:2,t:"2 - Alvorlig tap"}]},
            { id:"nihss_9", title:"9 Språk/afasi", options:[{v:0,t:"0 - Normal"},{v:1,t:"1 - Lett/moderat afasi"},{v:2,t:"2 - Alvorlig afasi"},{v:3,t:"3 - Mutisme/global afasi"}]},
            { id:"nihss_10", title:"10 Dysartri", options:[{v:0,t:"0 - Normal"},{v:1,t:"1 - Lett/moderat"},{v:2,t:"2 - Alvorlig/anartri"}]},
            { id:"nihss_11", title:"11 Neglekt", options:[{v:0,t:"0 - Ingen"},{v:1,t:"1 - Delvis"},{v:2,t:"2 - Alvorlig"}]}
        ];

        var tewsRanges = [
            { name: "Nyfødt < 1 mnd", minM: 0, maxM: 1, resp: [{max: 24, val: 3}, {max: 39, val: 2}, {max: 55, val: 0}, {max: 64, val: 1}, {max: 79, val: 2}, {max: Infinity, val: 3}], puls: [{max: 84, val: 3}, {max: 99, val: 2}, {max: 160, val: 0}, {max: 169, val: 1}, {max: 189, val: 2}, {max: Infinity, val: 3}], temp: [{max: 35.99, val: 3}, {max: 38.0, val: 0}, {max: Infinity, val: 1}] },
            { name: "1-12 mnd", minM: 1, maxM: 12, resp: [{max: 19, val: 3}, {max: 34, val: 2}, {max: 45, val: 0}, {max: 54, val: 1}, {max: 69, val: 2}, {max: Infinity, val: 3}], puls: [{max: 79, val: 3}, {max: 99, val: 2}, {max: 160, val: 0}, {max: 169, val: 1}, {max: 189, val: 2}, {max: Infinity, val: 3}], temp: [{max: 35.99, val: 3}, {max: 38.0, val: 0}, {max: 39.0, val: 1}, {max: Infinity, val: 3}] },
            { name: "1-3 år", minM: 12, maxM: 48, resp: [{max: 19, val: 3}, {max: 24, val: 2}, {max: 35, val: 0}, {max: 44, val: 1}, {max: 59, val: 2}, {max: Infinity, val: 3}], puls: [{max: 69, val: 3}, {max: 89, val: 2}, {max: 130, val: 0}, {max: 139, val: 1}, {max: 159, val: 2}, {max: Infinity, val: 3}], temp: [{max: 35.99, val: 3}, {max: 38.0, val: 0}, {max: 39.0, val: 1}, {max: Infinity, val: 3}] },
            { name: "4-6 år", minM: 48, maxM: 84, resp: [{max: 14, val: 3}, {max: 19, val: 2}, {max: 24, val: 0}, {max: 29, val: 1}, {max: 44, val: 2}, {max: Infinity, val: 3}], puls: [{max: 59, val: 3}, {max: 69, val: 2}, {max: 120, val: 0}, {max: 129, val: 1}, {max: 149, val: 2}, {max: Infinity, val: 3}], temp: [{max: 35.99, val: 3}, {max: 38.0, val: 0}, {max: 39.0, val: 1}, {max: Infinity, val: 3}] },
            { name: "7–12 år", minM: 84, maxM: 156, resp: [{max: 13, val: 3}, {max: 18, val: 2}, {max: 22, val: 0}, {max: 29, val: 1}, {max: 39, val: 2}, {max: Infinity, val: 3}], puls: [{max: 59, val: 3}, {max: 69, val: 2}, {max: 110, val: 0}, {max: 119, val: 1}, {max: 139, val: 2}, {max: Infinity, val: 3}], temp: [{max: 35.99, val: 3}, {max: 38.0, val: 0}, {max: 39.0, val: 1}, {max: Infinity, val: 3}] },
            { name: "13-15 år", minM: 156, maxM: 180, resp: [{max: 8, val: 3}, {max: 13, val: 2}, {max: 19, val: 0}, {max: 29, val: 2}, {max: Infinity, val: 3}], puls: [{max: 44, val: 3}, {max: 54, val: 2}, {max: 95, val: 0}, {max: 114, val: 1}, {max: 129, val: 2}, {max: Infinity, val: 3}], temp: [{max: 35.99, val: 3}, {max: 38.0, val: 0}, {max: 39.0, val: 1}, {max: Infinity, val: 3}] }
        ];

        var ciwaData = [
            { id: "ciwa_1", title: "Kvalme og oppkast", tooltip: "Spør: \"Føler du deg kvalm? Har du kastet opp?\"", options: [ {v:0, t:"0 - Ingen kvalme/oppkast"}, {v:1, t:"1 - Lett kvalme, ingen oppkast"}, {v:2, t:"2"}, {v:3, t:"3"}, {v:4, t:"4 - Intermitterende kvalme med brekninger"}, {v:5, t:"5"}, {v:6, t:"6"}, {v:7, t:"7 - Stadig kvalme, hyppige brekninger/oppkast"} ] },
            { id: "ciwa_2", title: "Tremor (skjelving)", tooltip: "Armene utstrakt med spredte fingre.", options: [ {v:0, t:"0 - Ingen tremor"}, {v:1, t:"1 - Ikke synlig, men kan kjennes"}, {v:2, t:"2"}, {v:3, t:"3"}, {v:4, t:"4 - Moderat, med strakte armer"}, {v:5, t:"5"}, {v:6, t:"6"}, {v:7, t:"7 - Kraftig, selv uten strakte armer"} ] },
            { id: "ciwa_3", title: "Svette", tooltip: "Observasjon", options: [ {v:0, t:"0 - Ingen svette"}, {v:1, t:"1 - Klam i hendene"}, {v:2, t:"2"}, {v:3, t:"3"}, {v:4, t:"4 - Perler av svette på pannen"}, {v:5, t:"5"}, {v:6, t:"6"}, {v:7, t:"7 - Gjennomvåt av svette"} ] },
            { id: "ciwa_4", title: "Angst", tooltip: "Spør: \"Føler du deg nervøs?\"", options: [ {v:0, t:"0 - Ingen angst, rolig"}, {v:1, t:"1 - Mildt engstelig"}, {v:2, t:"2"}, {v:3, t:"3"}, {v:4, t:"4 - Moderat engstelig eller urolig"}, {v:5, t:"5"}, {v:6, t:"6"}, {v:7, t:"7 - Akutt panikk, sterk dødsangst"} ] },
            { id: "ciwa_5", title: "Agitasjon / Uro", tooltip: "Obervasjon", options: [ {v:0, t:"0 - Normal aktivitet"}, {v:1, t:"1 - Noe overaktiv"}, {v:2, t:"2"}, {v:3, t:"3"}, {v:4, t:"4 - Moderat urolig og rastløs"}, {v:5, t:"5"}, {v:6, t:"6"}, {v:7, t:"7 - Ganger frem og tilbake, kaster på seg"} ] },
            { id: "ciwa_6", title: "Taktile forstyrrelser", tooltip: "Spør: \"Har du noe form for kløe, prikking, stikking, brennende/sviende følelse, nummenhet, eller kjenner du at småkryp kravler på eller under huden din?\"", options: [ {v:0, t:"0 - Ingen"}, {v:1, t:"1 - Veldig mild kløe/prikking/nummenhet"}, {v:2, t:"2 - Mild kløe/prikking/nummenhet"}, {v:3, t:"3 - Moderat kløe/prikking/nummenhet"}, {v:4, t:"4 - Sterke hallusinasjoner"}, {v:5, t:"5 - Sterke og vedvarende hallusinasjoner"}, {v:6, t:"6 - Ekstremt sterke hallusinasjoner"}, {v:7, t:"7 - Kontinuerlige hallusinasjoner"} ] },
            { id: "ciwa_7", title: "Auditive forstyrrelser", tooltip: "Spør: \"Er du mer oppmerksom på lyder rundt deg? Er de ubehagelige? Skremmer de deg? Hører du noe som er urovekkende? Hører du ting som du vet ikke er der?\"", options: [ {v:0, t:"0 - Ingen"}, {v:1, t:"1 - Veldig mild skvettenhet/lydømfintlighet"}, {v:2, t:"2 - Mild skvettenhet/lydømfintlighet"}, {v:3, t:"3 - Moderat skvettenhet/lydømfintlighet"}, {v:4, t:"4 - Sterke hallusinasjoner"}, {v:5, t:"5 - Sterke og vedvarende hallusinasjoner"}, {v:6, t:"6 - Ekstremt sterke hallusinasjoner"}, {v:7, t:"7 - Kontinuerlige hallusinasjoner"} ] },
            { id: "ciwa_8", title: "Visuelle forstyrrelser", tooltip: "Spør: \"Virker lyset sterkere enn vanlig? Oppleves farger annerledes enn vanlig? Gjør det vondt for øynene? Ser du noe som er urovekkende? Ser du ting som du vet ikke er der?\"", options: [ {v:0, t:"0 - Ingen"}, {v:1, t:"1 - Veldig mild lysømfintlighet"}, {v:2, t:"2 - Mild lysømfintlighet"}, {v:3, t:"3 - Moderat lysømfintlighet"}, {v:4, t:"4 - Sterke hallusinasjoner"}, {v:5, t:"5 - Sterke og vedvarende hallusinasjoner"}, {v:6, t:"6 - Ekstremt sterke hallusinasjoner"}, {v:7, t:"7 - Kontinuerlige hallusinasjoner"} ] },
            { id: "ciwa_9", title: "Hodepine / Trykk i hodet", tooltip: "Spør: \"Føles hodet annerledes? Føles det som om det er et bånd rundt hodet ditt?\" Ikke skår for svimmelhet eller ørhet. Forøvrig skåres alvorlighetsgrad.", options: [ {v:0, t:"0 - Ingen"}, {v:1, t:"1 - Veldig mild"}, {v:2, t:"2 - Mild"}, {v:3, t:"3 - Moderat"}, {v:4, t:"4 - Moderat til sterk"}, {v:5, t:"5 - Sterk"}, {v:6, t:"6 - Veldig sterk"}, {v:7, t:"7 - Ekstremt sterk"} ] },
            { id: "ciwa_10", title: "Orienteringsevne", tooltip: "Spør: \"Hvilken dag er det i dag? Hvor er du? Hvem er jeg? Vennligst legg sammen følgende tall...\"", options: [ {v:0, t:"0 - Orientert (vet hvem, hvor, når)"}, {v:1, t:"1 - Usikker på dato"}, {v:2, t:"2 - Desorientert for dato (>2 dager)"}, {v:3, t:"3 - Desorientert for sted eller person"}, {v:4, t:"4 - Helt desorientert for tid, sted og person"} ] }
        ];

        // --- HELPER TO GET FLOAT FROM COMMA OR DOT ---
        function getNum(id) {
            return parseFloat(document.getElementById(id).value.replace(',', '.'));
        }

        // --- VALIDERINGS- OG FORMATERINGSFUNKSJONER ---
        function formatInput(el, allowDecimal) {
            el.value = el.value.replace(allowDecimal ? /[^\d.,]/g : /[^\d]/g, '');
            if (allowDecimal) {
                var parts = el.value.split(/[.,]/);
                if (parts.length > 2) {
                    var sep = el.value.indexOf(',') !== -1 ? ',' : '.';
                    el.value = parts[0] + sep + parts.slice(1).join('');
                }
            }
            try{updateHeaderByCategory(localStorage.getItem('scoreCategory'));}catch(e){}
            calculateScore();
        }

        function formatAbcdSbpInput(el) {
            formatInput(el, false);
            if (el.value.length >= 3) {
                var dbp = document.getElementById('abcd_dbp');
                if (dbp && document.activeElement === el) dbp.focus();
            }
        }

        function formatTemperatureInput(el, event) {
            var digits = el.value.replace(/\D/g, '').slice(0, 3);
            var isBackspace = event && event.inputType === 'deleteContentBackward';
            if (isBackspace && el.value.indexOf(',') === -1 && digits.length > 0) {
                digits = digits.slice(0, -1);
            }
            if (digits.length > 2) el.value = digits.slice(0, 2) + ',' + digits.slice(2);
            else if (digits.length > 0) el.value = digits + ',';
            else el.value = '';
            try{updateHeaderByCategory(localStorage.getItem('scoreCategory'));}catch(e){}
            calculateScore();
        }

        function validateInput(el, min, max) {
            if(!el.value) {
                el.classList.remove('input-score-0', 'input-score-1', 'input-score-2');
                calculateScore();
                return;
            }
            
            var val = parseFloat(el.value.replace(',', '.'));
            if (isNaN(val)) return;

            if (val < min || val > max) {
                showToast("Ugyldig verdi. Må være mellom " + min + " og " + max + ".", true);
                el.value = '';
                el.classList.remove('input-score-0', 'input-score-1', 'input-score-2');
                setTimeout(function() { el.focus(); }, 10);
            }
            
            calculateScore();
        }

        function validateTemperatureInput(el, min, max) {
            if (el.value && /^\d{2},?$/.test(el.value)) {
                el.value = el.value.replace(',', '') + ',0';
                showToast("Temperatur endret til " + el.value + ".", false);
            }

            validateInput(el, min, max);
        }

        function validateAbcdBloodPressure(el, min, max) {
            validateInput(el, min, max);
            if (!el.value) return;

            var sbp = document.getElementById('abcd_sbp');
            var dbp = document.getElementById('abcd_dbp');
            if (!sbp || !dbp || !sbp.value || !dbp.value) return;

            var sbpValue = parseFloat(sbp.value.replace(',', '.'));
            var dbpValue = parseFloat(dbp.value.replace(',', '.'));
            if (isNaN(sbpValue) || isNaN(dbpValue) || dbpValue <= sbpValue) return;

            showToast("Diastolisk blodtrykk kan ikke v\u00e6re h\u00f8yere enn systolisk blodtrykk.", true);
            el.value = '';
            el.classList.remove('input-score-0', 'input-score-1', 'input-score-2');
            calculateScore();
            setTimeout(function() { el.focus(); }, 10);
        }

        // --- FARGEOPPDATERING P? FELTER ---
        function updateInputColor(id, score, isInvalid) {
            var el = document.getElementById(id);
            if (!el) return;
            
            el.classList.remove('input-score-0', 'input-score-1', 'input-score-2');
            
            if (isInvalid) return; 
            
            if (score === 0) el.classList.add('input-score-0');
            else if (score === 1) el.classList.add('input-score-1');
            else if (score >= 2) el.classList.add('input-score-2');
        }

        // --- SKALA-LOGIKK MED MODAL ---
        function setScaleChoice(hiddenId, radioId, value) {
            var hidden = document.getElementById(hiddenId);
            var radio = document.getElementById(radioId);
            if (hidden) hidden.value = value;
            if (radio) radio.checked = true;
        }

        function handleScaleChange() {
            var select = document.getElementById('news2-scale');
            if (select.value === '2') {
                var warningText = "Skala 2 skal kun brukes på pasienter med kjent hyperkapnisk respirasjonssvikt med mål om SpO2 mellom 88-92 %, verifisert ved blodgassanalyse.\n\nLege skal dokumentere i journal når Skala 2 skal brukes. Ved alle andre tilfeller skal Skala 1 benyttes.\n\nEr du sikker på at du vil bruke Skala 2?";
                
                document.getElementById('modal-body').innerText = warningText;
                document.getElementById('confirm-modal').classList.add('show');
                
                document.getElementById('modal-btn-yes').onclick = function() {
                    document.getElementById('confirm-modal').classList.remove('show');
                    calculateScore();
                };
                
                document.getElementById('modal-btn-no').onclick = function() {
                    document.getElementById('confirm-modal').classList.remove('show');
                    setScaleChoice('news2-scale', 'news2_scale_1', '1');
                    calculateScore();
                };
            } else {
                calculateScore();
            }
        }

        
function updateHeaderByCategory(cat){
  var h = document.getElementById('app-title');
  if (!h) return;
  var svg = h.innerHTML.split('</svg>')[0] + '</svg>';
  var txt = ' Legevakt - Scoringsverktøy';
  if (cat === 'triage') txt = ' Legevakt - Triage';
  if (cat === 'other' || cat === 'annet') txt = ' Legevakt - Andre scores';
  h.innerHTML = svg + txt;
  document.title = txt.trim();
}

// Initialization
        document.addEventListener('DOMContentLoaded', function() {
            renderAllChecklists();
            renderCiwaForm();
            renderNihssForm();
            enhanceChoicePointBadges();
            setupEventListeners();
            setupChoiceKeyboardSupport();
            initializeSettings();
            var preferredHome = getSetting('homePage');
            var savedTab = localStorage.getItem('scoretool-tab');
            if (preferredHome === 'triage' || preferredHome === 'other') { openCategory(preferredHome, savedTab); } else { showWelcomeMenu(); }
            calculateScore();
        });

        function setCookie(name, value, days) {
            var expires = '';
            if (typeof days === 'number') {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
        }

        function getCookie(name) {
            var prefix = name + '=';
            var parts = document.cookie ? document.cookie.split(';') : [];
            for (var i = 0; i < parts.length; i++) {
                var cookie = parts[i].trim();
                if (cookie.indexOf(prefix) === 0) return decodeURIComponent(cookie.substring(prefix.length));
            }
            return '';
        }

        function getSetting(name) {
            var cookieName = 'scoretool-' + name;
            var value = getCookie(cookieName);
            if (value !== '') return value;
            try {
                var stored = localStorage.getItem(cookieName);
                if (stored !== null && stored !== '') return stored;
            } catch (e) {}
            return defaultSettings[name];
        }

        function applyTextSize(size) {
            document.body.classList.remove('text-large', 'text-xlarge');
            if (size === 'large') document.body.classList.add('text-large');
        }

        function applyDarkMode(isEnabled) {
            document.body.classList.toggle('dark-mode', isEnabled);
        }

        function applyHideScoreInfo(isEnabled) {
            document.body.classList.toggle('hide-score-info', isEnabled);
        }

        function syncSettingsUI() {
            var homeSelect = document.getElementById('setting-home-page');
            var sizeRadios = document.querySelectorAll('input[name="setting-text-size"]');
            var darkToggle = document.getElementById('setting-dark-mode');
            var hideScoreInfoToggle = document.getElementById('setting-hide-score-info');
            if (homeSelect) homeSelect.value = getSetting('homePage');
            var textSize = getSetting('textSize') === 'xlarge' ? 'large' : getSetting('textSize');
            for (var i = 0; i < sizeRadios.length; i++) {
                sizeRadios[i].checked = sizeRadios[i].value === textSize;
            }
            if (darkToggle) darkToggle.checked = getSetting('darkMode') === '1';
            if (hideScoreInfoToggle) hideScoreInfoToggle.checked = getSetting('hideScoreInfo') === '1';
        }

        function initializeSettings() {
            var textSize = getSetting('textSize');
            if (textSize === 'xlarge') textSize = 'large';
            applyTextSize(textSize);
            applyDarkMode(getSetting('darkMode') === '1');
            applyHideScoreInfo(getSetting('hideScoreInfo') === '1');
            syncSettingsUI();
            setToolPatientSheetLanguage(currentPatientSheet || 'no');
        }

        function handleSettingChange(name, value) {
            if (name === 'textSize' && value === 'xlarge') value = 'large';
            setCookie('scoretool-' + name, value, settingsCookieDays);
            try {
                localStorage.setItem('scoretool-' + name, value);
            } catch (e) {}
            if (name === 'textSize') applyTextSize(value);
            else if (name === 'darkMode') applyDarkMode(value === '1');
            else if (name === 'hideScoreInfo') applyHideScoreInfo(value === '1');
            syncSettingsUI();
        }

        function toggleSettingsPanel() {
            var panel = document.getElementById('settings-panel');
            var toggle = document.getElementById('settings-toggle');
            if (!panel || !toggle) return;
            var isHidden = panel.classList.contains('hidden');
            panel.classList.toggle('hidden', !isHidden);
            toggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        }

        function closeSettingsPanel() {
            var panel = document.getElementById('settings-panel');
            var toggle = document.getElementById('settings-toggle');
            if (panel) panel.classList.add('hidden');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }


        function showWelcomeMenu() {
            updateHeaderByCategory(null);
            currentCategory = null;
            closeSettingsPanel();
            document.getElementById('welcome-menu').classList.remove('hidden');
            document.getElementById('sources-link').classList.remove('hidden');
            document.getElementById('header-back-btn').classList.add('hidden');
            document.getElementById('main-nav').classList.add('hidden');
            document.querySelector('.content-wrap').classList.add('hidden');
            document.querySelector('.score-footer').classList.add('hidden');
        }

        function openCategory(category, preferredTab) {
            updateHeaderByCategory(category);
            currentCategory = category;
            closeSettingsPanel();
            localStorage.setItem('scoretool-category', category);
            document.getElementById('welcome-menu').classList.add('hidden');
            document.getElementById('sources-link').classList.add('hidden');
            document.getElementById('header-back-btn').classList.remove('hidden');
            document.getElementById('main-nav').classList.remove('hidden');
            document.querySelector('.content-wrap').classList.remove('hidden');
            document.querySelector('.score-footer').classList.remove('hidden');

            var visibleTargets = [];
            var btns = document.querySelectorAll('.tab-btn');
            for (var i=0; i<btns.length; i++) {
                var cats = (btns[i].getAttribute('data-category') || '').split(' ');
                var show = cats.indexOf(category) !== -1;
                btns[i].classList.toggle('hidden', !show);
                if (show) visibleTargets.push(btns[i].getAttribute('data-target'));
            }

            var target = preferredTab && visibleTargets.indexOf(preferredTab) !== -1 ? preferredTab : visibleTargets[0];
            switchTab(target);
        }
        function switchTab(tabId) {
            if (!document.getElementById(tabId)) tabId = 'news2';
            var sections = document.querySelectorAll('.calc-section');
            for(var i=0; i<sections.length; i++) {
                sections[i].classList.remove('active');
            }
            
            var btns = document.querySelectorAll('.tab-btn');
            for(var j=0; j<btns.length; j++) {
                btns[j].classList.remove('active');
            }
            
            document.getElementById(tabId).classList.add('active');
            var activeBtn = document.querySelector('button[data-target="' + tabId + '"]');
            if (activeBtn) activeBtn.classList.add('active');
            
            currentTab = tabId;
            localStorage.setItem('scoretool-tab', tabId);
            syncChoiceTabState();
            calculateScore();
            focusFirstScoringControl(tabId);
        }
        
        // Forma j?sira (Reset form)
function resetForm(silent) {
            currentRegistrationCopied = false;
            var textInputs = document.querySelectorAll('input[type="text"]');
            for(var i=0; i<textInputs.length; i++) {
                textInputs[i].value = '';
                textInputs[i].classList.remove('input-score-0', 'input-score-1', 'input-score-2');
            }
            
            var radios = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            for(var j=0; j<radios.length; j++) {
                radios[j].checked = false;
            }
            
            setScaleChoice('news2-scale', 'news2_scale_1', '1');
            setScaleChoice('qsn_scale', 'qsn_scale_1', '1');
            document.getElementById('tews-age-unit').value = "y";
            document.getElementById('tews-active-group').innerText = "";
            syncTEWSFieldState(-1);
            
            var ciwaSelects = document.querySelectorAll('.ciwa-select');
            for(var k=0; k<ciwaSelects.length; k++) {
                ciwaSelects[k].value = "";
            }
            
            var pointDisplays = document.querySelectorAll('.point-display');
            for(var l=0; l<pointDisplays.length; l++) {
                pointDisplays[l].textContent = '-';
                pointDisplays[l].className = 'point-display point-muted';
            }
            
            syncChoiceTabState();
            calculateScore();
            if (!silent) showToast("Skjema nullstilt", false);
        }

        function escapeAttr(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function enhanceChoicePointBadges() {
            var groups = document.querySelectorAll('#abcd2 .pill-radio, #gcs .pill-radio, #chads .chads-top-grid .pill-radio');
            for (var i = 0; i < groups.length; i++) {
                groups[i].classList.add('choice-has-points');
                var inputs = groups[i].querySelectorAll('input[type="radio"], input[type="checkbox"]');
                for (var j = 0; j < inputs.length; j++) {
                    var input = inputs[j];
                    var label = document.querySelector('label[for="' + input.id + '"]');
                    if (!label || label.dataset.pointEnhanced === 'true') continue;
                    label.textContent = label.textContent.replace(/\s*\(\d+p\)/g, '');
                    var badge = document.createElement('span');
                    badge.className = 'choice-point-badge';
                    badge.textContent = input.value + 'p';
                    label.appendChild(badge);
                    label.dataset.pointEnhanced = 'true';
                }
            }
        }

        function renderCiwaForm() {
            var container = document.getElementById('ciwa-form-grid');
            container.innerHTML = '';
            
            for(var i=0; i<ciwaData.length; i++) {
                var item = ciwaData[i];
                var optionsHtml = '<option value="" disabled selected>Velg score...</option>';
                for(var j=0; j<item.options.length; j++) {
                    var opt = item.options[j];
                    optionsHtml += '<option value="' + opt.v + '">' + opt.t + '</option>';
                }
                
                var tooltipHtml = item.tooltip ? '<span class="tooltip-icon" tabindex="0" aria-label="' + escapeAttr(item.tooltip) + '" data-tooltip="' + escapeAttr(item.tooltip) + '">i</span>' : '';
                
                container.innerHTML += 
                    '<div class="input-card ciwa-card">' +
                        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">' +
                            '<label class="label" style="margin-bottom: 0;">' + item.title + '</label>' +
                            tooltipHtml +
                        '</div>' +
                        '<select id="' + item.id + '" class="form-select ciwa-select" onchange="calculateScore()">' +
                            optionsHtml +
                        '</select>' +
                    '</div>';
            }
        }

        function renderNihssForm() {
            var container = document.getElementById('nihss-form-grid');
            container.innerHTML = '';
            for (var i=0; i<nihssData.length; i++) {
                var item = nihssData[i];
                var optionsHtml = '<option value="" disabled selected>Velg score...</option>';
                for (var j=0; j<item.options.length; j++) {
                    var opt = item.options[j];
                    optionsHtml += '<option value="' + opt.v + '">' + opt.t + '</option>';
                }
                container.innerHTML += '<div class="input-card ciwa-card"><label class="label">' + item.title + '</label><select id="' + item.id + '" class="form-select ciwa-select" onchange="calculateScore()">' + optionsHtml + '</select></div>';
            }
        }

        function buildChecklistHTML(dataArray, prefix) {
            var html = '';
            for(var i=0; i<dataArray.length; i++) {
                var item = dataArray[i];
                html += 
                    '<div class="wells-row">' +
                        '<span class="wells-text">' + item.text + '</span>' +
                        '<div class="wells-btn-group wells-btn">' +
                            '<input type="radio" name="' + prefix + '_' + i + '" id="' + prefix + '_' + i + '_ja" value="' + item.val + '" class="hidden wells-ja">' +
                            '<label for="' + prefix + '_' + i + '_ja">Ja</label>' +
                            '<input type="radio" name="' + prefix + '_' + i + '" id="' + prefix + '_' + i + '_nei" value="0" class="hidden wells-nei">' +
                            '<label for="' + prefix + '_' + i + '_nei">Nei</label>' +
                            '<span class="point-display point-muted">-</span>' +
                        '</div>' +
                    '</div>';
            }
            return html;
        }

        function renderAllChecklists() {
            document.getElementById('wells-dvt-form').innerHTML = buildChecklistHTML(wellsDVTData, 'dvt');
            document.getElementById('wells-le-form').innerHTML = buildChecklistHTML(wellsLEData, 'le');
            if (document.getElementById('mantrel-form')) document.getElementById('mantrel-form').innerHTML = buildChecklistHTML(mantrelData, 'mantrel');
            document.getElementById('qsofa-form').innerHTML = buildChecklistHTML(qSofaData, 'qsofa');
            document.getElementById('chads-form').innerHTML = buildChecklistHTML(chadsData, 'chads');
            document.getElementById('curb65-form').innerHTML = buildChecklistHTML(curb65Data, 'curb65');
            document.getElementById('mantrel-form').innerHTML = buildChecklistHTML(mantrelData, 'mantrel');
        }

        function setupEventListeners() {
            var inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            for(var i=0; i<inputs.length; i++) {
                inputs[i].addEventListener('change', function() {
                    currentRegistrationCopied = false;
                    calculateScore();
                });
            }
            var textInputs = document.querySelectorAll('input[type="text"]');
            for (var j=0; j<textInputs.length; j++) {
                textInputs[j].addEventListener('input', function() {
                    currentRegistrationCopied = false;
                });
            }
            var selects = document.querySelectorAll('select');
            for (var k=0; k<selects.length; k++) {
                selects[k].addEventListener('change', function() {
                    currentRegistrationCopied = false;
                });
            }
            document.addEventListener('click', function(event) {
                var panel = document.getElementById('settings-panel');
                var toggle = document.getElementById('settings-toggle');
                if (!panel || panel.classList.contains('hidden')) return;
                var insidePanel = panel.contains(event.target);
                var insideToggle = toggle && toggle.contains(event.target);
                if (!insidePanel && !insideToggle) closeSettingsPanel();
            });
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') closeSettingsPanel();
            });
        }

        function isElementVisible(el) {
            return !!(el && el.offsetParent !== null);
        }

        function getChoiceLabelsForInput(input) {
            if (!input || !input.name) return [];
            var selector = 'label[for="' + input.id + '"]';
            var labels = document.querySelectorAll('input[name="' + input.name + '"]');
            var group = [];
            for (var i = 0; i < labels.length; i++) {
                var lbl = document.querySelector(selector.replace(input.id, labels[i].id));
                if (lbl && !labels[i].disabled && isElementVisible(lbl)) group.push(lbl);
            }
            return group;
        }

        function setupChoiceKeyboardSupport() {
            var labels = document.querySelectorAll('label[for]');
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                var input = document.getElementById(label.getAttribute('for'));
                if (!input || (input.type !== 'radio' && input.type !== 'checkbox')) continue;

                label.tabIndex = input.disabled || shouldSkipChoiceFocus(input) ? -1 : 0;
                label.setAttribute('role', input.type);
                label.setAttribute('aria-disabled', input.disabled ? 'true' : 'false');

                if (label.dataset.keyboardBound === 'true') continue;
                label.dataset.keyboardBound = 'true';

                label.addEventListener('keydown', function(event) {
                    var currentLabel = event.currentTarget;
                    var currentInput = document.getElementById(currentLabel.getAttribute('for'));
                    if (!currentInput || currentInput.disabled) return;

                    if (event.key === ' ' || event.key === 'Enter') {
                        event.preventDefault();
                        currentInput.click();
                        return;
                    }

                    if (currentInput.type !== 'radio') return;
                    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(event.key) === -1) return;

                    event.preventDefault();
                    var groupLabels = getChoiceLabelsForInput(currentInput);
                    if (!groupLabels.length) return;

                    var currentIndex = groupLabels.indexOf(currentLabel);
                    if (currentIndex === -1) return;

                    var direction = (event.key === 'ArrowLeft' || event.key === 'ArrowUp') ? -1 : 1;
                    var nextIndex = (currentIndex + direction + groupLabels.length) % groupLabels.length;
                    var nextLabel = groupLabels[nextIndex];
                    var nextInput = document.getElementById(nextLabel.getAttribute('for'));

                    if (nextInput && !nextInput.disabled) {
                        nextInput.click();
                        nextLabel.focus();
                    }
                });
            }
        }

        function shouldSkipChoiceFocus(input) {
            if (!input) return true;
            return input.tabIndex < 0 || input.name === 'news2_scale_choice' || input.name === 'qsn_scale_choice';
        }

        function syncChoiceTabState() {
            var labels = document.querySelectorAll('label[for]');
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                var input = document.getElementById(label.getAttribute('for'));
                if (!input || (input.type !== 'radio' && input.type !== 'checkbox')) continue;
                var enabled = !input.disabled && isElementVisible(label);
                label.tabIndex = enabled && !shouldSkipChoiceFocus(input) ? 0 : -1;
                label.setAttribute('aria-disabled', enabled ? 'false' : 'true');
            }
        }

        function getFocusableScoringElement(section) {
            if (!section) return null;
            var candidates = section.querySelectorAll('input, select, textarea, button, label[for]');
            for (var i = 0; i < candidates.length; i++) {
                var el = candidates[i];
                if (!isElementVisible(el) || el.disabled) continue;

                if (el.tagName === 'LABEL') {
                    var input = document.getElementById(el.getAttribute('for'));
                    if (!input || input.disabled || shouldSkipChoiceFocus(input)) continue;
                    if (input.type !== 'radio' && input.type !== 'checkbox') continue;
                    return el;
                }

                if (el.type === 'hidden' || el.type === 'radio' || el.type === 'checkbox') continue;
                if (el.tabIndex < 0) continue;
                return el;
            }
            return null;
        }

        function focusFirstScoringControl(tabId) {
            window.setTimeout(function() {
                var section = document.getElementById(tabId);
                var target = getFocusableScoringElement(section);
                if (target) target.focus({ preventScroll: true });
            }, 0);
        }

        function syncTEWSFieldState(ageGroup) {
            var useTeenSBP = ageGroup === 5;
            var hasValidAgeGroup = ageGroup >= 0;
            var kfCard = document.getElementById('tews-kf-card');
            var sbpCard = document.getElementById('tews-sbp-card');
            var kfInput = document.getElementById('t_kf');
            var sbpInput = document.getElementById('t_sbp');

            if (kfCard && sbpCard) {
                kfCard.classList.toggle('hidden', !hasValidAgeGroup || useTeenSBP);
                sbpCard.classList.toggle('hidden', !hasValidAgeGroup || !useTeenSBP);
                kfCard.setAttribute('aria-disabled', (!hasValidAgeGroup || useTeenSBP) ? 'true' : 'false');
                sbpCard.setAttribute('aria-disabled', (!hasValidAgeGroup || !useTeenSBP) ? 'true' : 'false');
            }

            if (kfInput) {
                kfInput.disabled = !hasValidAgeGroup || useTeenSBP;
                kfInput.tabIndex = (!hasValidAgeGroup || useTeenSBP) ? -1 : 0;
            }
            if (sbpInput) {
                sbpInput.disabled = !hasValidAgeGroup || !useTeenSBP;
                sbpInput.tabIndex = (hasValidAgeGroup && useTeenSBP) ? 0 : -1;
            }
        }


        function calcTewsSpo2(spo2, hasO2) {
            if (isNaN(spo2)) return 0;
            if (hasO2) {
                if (spo2 < 90) return 3;
                return 2;
            }
            if (spo2 >= 90 && spo2 <= 95) return 1;
            if (spo2 > 95) return 0;
            return 3;
        }

        function evalRule(val, rules) {
            if (isNaN(val)) return 0;
            for (var i=0; i<rules.length; i++) {
                var rule = rules[i];
                if (val <= rule.max) return rule.val;
            }
            return 0;
        }

        // Generell sjekkliste-kalkulator
        function calcChecklistScore(containerId) {
            var container = document.getElementById(containerId);
            if (!container) return { score: 0, checkedCount: 0, totalRows: 0 };

            var score = 0;
            var checkedCount = 0;
            var rows = container.querySelectorAll('.wells-row');
            var totalRows = rows.length;

            for(var i=0; i<rows.length; i++) {
                var row = rows[i];
                var jaRadio = row.querySelector('input.wells-ja');
                var neiRadio = row.querySelector('input.wells-nei');
                var pointDisplay = row.querySelector('.point-display');

                if (jaRadio && jaRadio.checked) {
                    checkedCount++;
                    score += parseFloat(jaRadio.value);
                    if (pointDisplay) {
                        pointDisplay.textContent = jaRadio.value > 0 ? '+' + jaRadio.value : jaRadio.value;
                        pointDisplay.className = 'point-display point-active';
                    }
                } else if (neiRadio && neiRadio.checked) {
                    checkedCount++;
                    if (pointDisplay) {
                        pointDisplay.textContent = '0';
                        pointDisplay.className = 'point-display point-zero';
                    }
                } else if (pointDisplay) {
                    pointDisplay.textContent = '-';
                    pointDisplay.className = 'point-display point-muted';
                }
            }

            return { score: score, checkedCount: checkedCount, totalRows: totalRows };
        }

        // Logikk (Logic & Calculation)
        function calculateScore() {
            var score = 0;
            var interpretation = "Fyll inn felter...";
            var colorClass = "score-0";
            var hasRedScore = false;
            

            if (currentTab === 'news2') {
                var resp = getNum('n2_resp');
                var spo2 = getNum('n2_spo2');
                var bp = getNum('n2_bp');
                var puls = getNum('n2_puls');
                var temp = getNum('n2_temp');
                
                var scale = document.getElementById('news2-scale').value;
                var o2Radio = document.querySelector('input[name="n2_o2"]:checked');
                var o2 = o2Radio ? parseInt(o2Radio.value) : 0;
                
                var avpuRadio = document.querySelector('input[name="n2_avpu"]:checked');
                var avpu = avpuRadio ? parseInt(avpuRadio.value) : 0;

                var respS = 0, spo2S = 0, bpS = 0, pulsS = 0, tempS = 0;

                if(!isNaN(resp)) {
                    if (resp <= 8) respS = 3; else if (resp <= 11) respS = 1; else if (resp <= 20) respS = 0; else if (resp <= 24) respS = 2; else respS = 3;
                }
                updateInputColor('n2_resp', respS, isNaN(resp));

                if(!isNaN(bp)) {
                    if (bp <= 90) bpS = 3; else if (bp <= 100) bpS = 2; else if (bp <= 110) bpS = 1; else if (bp <= 219) bpS = 0; else bpS = 3;
                }
                updateInputColor('n2_bp', bpS, isNaN(bp));

                if(!isNaN(puls)) {
                    if (puls <= 40) pulsS = 3; else if (puls <= 50) pulsS = 1; else if (puls <= 90) pulsS = 0; else if (puls <= 110) pulsS = 1; else if (puls <= 130) pulsS = 2; else pulsS = 3;
                }
                updateInputColor('n2_puls', pulsS, isNaN(puls));

                if(!isNaN(temp)) {
                    if (temp <= 35.0) tempS = 3; else if (temp <= 36.0) tempS = 1; else if (temp <= 38.0) tempS = 0; else if (temp <= 39.0) tempS = 1; else tempS = 2;
                }
                updateInputColor('n2_temp', tempS, isNaN(temp));

                if(!isNaN(spo2)) {
                    if (scale === '1') {
                        if (spo2 <= 91) spo2S = 3; else if (spo2 <= 93) spo2S = 2; else if (spo2 <= 95) spo2S = 1; else spo2S = 0;
                    } else if (scale === '2') {
                        if (spo2 <= 83) spo2S = 3; else if (spo2 <= 85) spo2S = 2; else if (spo2 <= 87) spo2S = 1; else if (spo2 <= 92) spo2S = 0; 
                        else if (spo2 >= 93) {
                            if (o2 === 2) { if (spo2 <= 94) spo2S = 1; else if (spo2 <= 96) spo2S = 2; else spo2S = 3; } else { spo2S = 0; }
                        }
                    }
                }
                updateInputColor('n2_spo2', spo2S, isNaN(spo2));

                score = respS + spo2S + o2 + bpS + pulsS + avpu + tempS;
var arr = [respS, spo2S, bpS, pulsS, avpu, tempS];
                for(var m=0; m<arr.length; m++) {
                    if (arr[m] === 3) { hasRedScore = true; break; }
                }

                var news2Complete = !isNaN(resp) && !isNaN(spo2) && !isNaN(bp) && !isNaN(puls) && !isNaN(temp) && o2Radio && avpuRadio;
                if (news2Complete) {
                    if (score === 0) { interpretation = "Lav risiko"; colorClass = "score-0"; }
                    else if (score >= 1 && score <= 4) { 
                        interpretation = hasRedScore ? "Lav-middels risiko" : "Lav risiko";
                        colorClass = hasRedScore ? "score-med" : "score-low"; 
                    }
                    else if (score >= 5 && score <= 6) { interpretation = "Middels risiko"; colorClass = "score-med"; }
                    else if (score >= 7) { interpretation = "Høy risiko"; colorClass = "score-high"; }
                } else {
                    score = "-";
                    var missingN2 = 0;
                    if (isNaN(resp)) missingN2++;
                    if (isNaN(spo2)) missingN2++;
                    if (isNaN(bp)) missingN2++;
                    if (isNaN(puls)) missingN2++;
                    if (isNaN(temp)) missingN2++;
                    if (!o2Radio) missingN2++;
                    if (!avpuRadio) missingN2++;
                    interpretation = missingN2 === 7 ? "Fyll inn felter..." : "Mangler svar på " + missingN2 + " punkt(er)";
                    colorClass = "score-0";
                }

            } else if (currentTab === 'tews') {
                var ageVal = getNum('tews-age-val');
                var ageUnit = document.getElementById('tews-age-unit').value;

                var ageGroup = -1;
                if(!isNaN(ageVal)) {
                    var m_age = ageUnit === 'y' ? ageVal * 12 : ageVal;
                    for (var ag=0; ag<tewsRanges.length; ag++) {
                        if (m_age >= tewsRanges[ag].minM && m_age < tewsRanges[ag].maxM) {
                            ageGroup = ag;
                            break;
                        }
                    }
                    if (ageGroup >= 0) {
                        document.getElementById('tews-active-group').innerText = ageGroup >= 0 ? "(" + tewsRanges[ageGroup].name + ")" : "(TEWS barn gjelder t.o.m. 15 år)";
                    } else {
                        document.getElementById('tews-active-group').innerText = "(TEWS barn gjelder < 15 år)";
                    }
                } else {
                    document.getElementById('tews-active-group').innerText = "";
                }

                if (ageGroup !== -1) {
                    var rules = tewsRanges[ageGroup];
                    var t_resp = getNum('t_resp');
                    var t_puls = getNum('t_puls');
                    var t_spo2 = getNum('t_spo2');
                    var t_temp = getNum('t_temp');

                    var t_o2Radio = document.querySelector('input[name="tews_o2"]:checked');
                    var t_hasO2 = t_o2Radio ? (t_o2Radio.value === "1") : false;

                    var t_avpuRadio = document.querySelector('input[name="tews_avpu"]:checked');
                    var t_avpu = t_avpuRadio ? parseInt(t_avpuRadio.value) : 0;

                    var extraScore = 0;
                    var t_extras = document.querySelectorAll('.tews-extra:checked');
                    for(var n=0; n<t_extras.length; n++) {
                        extraScore += parseInt(t_extras[n].value);
                    }

                    var t_respS = evalRule(t_resp, rules.resp);
                    var t_pulsS = evalRule(t_puls, rules.puls);
                    var t_spo2S = calcTewsSpo2(t_spo2, t_hasO2);
                    var t_tempS = evalRule(t_temp, rules.temp);

                    updateInputColor('t_resp', t_respS, isNaN(t_resp));
                    updateInputColor('t_puls', t_pulsS, isNaN(t_puls));
                    updateInputColor('t_spo2', t_spo2S, isNaN(t_spo2));
                    updateInputColor('t_temp', t_tempS, isNaN(t_temp));

                    score = t_respS + t_pulsS + t_spo2S + t_tempS + t_avpu + extraScore;

                    var t_arr = [t_respS, t_pulsS, t_spo2S, t_tempS, t_avpu];
                    for(var p=0; p<t_arr.length; p++) {
                        if(t_arr[p] === 3) { hasRedScore = true; break; }
                    }

                    if (!isNaN(t_resp) || !isNaN(t_puls) || !isNaN(t_spo2) || !isNaN(t_temp) || t_o2Radio || t_avpuRadio || extraScore > 0) {
                        if (score <= 2) { interpretation = "Grønn hastegrad"; colorClass = "score-0"; }
                        else if (score >= 3 && score <= 4) { interpretation = "Gul hastegrad"; colorClass = "score-low"; }
                        else if (score >= 5 && score <= 6) { interpretation = "Oransje hastegrad"; colorClass = "score-med"; }
                        else if (score >= 7) { interpretation = "Rød hastegrad"; colorClass = "score-high"; }
                    }
                } else {
                    updateInputColor('t_resp', 0, true);
                    updateInputColor('t_puls', 0, true);
                    updateInputColor('t_spo2', 0, true);
                    updateInputColor('t_temp', 0, true);
                }

            } else if (currentTab === 'qsofa') {
                var calcQ = calcChecklistScore('qsofa-form');
                if (calcQ.checkedCount === calcQ.totalRows && calcQ.totalRows > 0) {
                    score = calcQ.score;
                    if (score < 2) {
                        setQsofaNews2PanelVisible(false);
                        interpretation = "Lav risiko for sepsis-relatert dårlig utfall";
                        colorClass = "score-0";
                    } else {
                        setQsofaNews2PanelVisible(true);
                        var qNews = getQsofaNews2State();
                        if (qNews.complete) {
                            score = calcQ.score + "/" + qNews.score;
                            var qTriage = setTriageInterpretation(qNews.score, qNews.hasRed);
                            interpretation = "qSOFA ≥ 2. NEWS2: " + qTriage.text;
                            colorClass = qNews.score >= 5 || qNews.hasRed ? "score-high" : qTriage.cls;
                            if (qNews.score >= 5 || qNews.hasRed) setQsofaNews2Advice("Høy risiko ved mistenkt sepsis. Vurder rask legetilsyn og videre sepsishåndtering.", "bad");
                            else setQsofaNews2Advice("qSOFA er positiv. NEWS2 er lavere, men klinisk mistanke om sepsis skal fortsatt vurderes og målinger bør gjentas ved forverring.", "warn");
                        } else {
                            score = "-";
                            interpretation = "qSOFA ≥ 2. Fyll inn NEWS2 for videre risikovurdering.";
                            colorClass = "score-high";
                            setQsofaNews2Advice("Fyll inn felter i NEWS2 ved mistanke om sepsis.", "warn");
                        }
                    }
                } else {
                    score = "-";
                    var missingQ = calcQ.totalRows - calcQ.checkedCount;
                    interpretation = missingQ === calcQ.totalRows ? "Fyll inn felter..." : "Mangler svar på " + missingQ + " punkt(er)";
                    colorClass = "score-0";
                    setQsofaNews2PanelVisible(false);
                }

            } else if (currentTab === 'chads') {
                var calcC = calcChecklistScore('chads-form');
                var sexRadio = document.querySelector('input[name="chads_sex"]:checked');
                var ageRadio = document.querySelector('input[name="chads_age"]:checked');
                
                var isComplete = (calcC.checkedCount === calcC.totalRows) && sexRadio && ageRadio;
                
                if (isComplete) {
                    var sexScore = parseInt(sexRadio.value);
                    var ageScore = parseInt(ageRadio.value);
                    score = calcC.score + sexScore + ageScore;
                    
                    if (sexScore === 0) { 
                        if (score === 0) { interpretation = "Lav risiko. Ingen antikoagulasjon."; colorClass = "score-0"; }
                        else if (score === 1) { interpretation = "Moderat risiko. Vurder antikoagulasjon."; colorClass = "score-low"; }
                        else { interpretation = "Høy risiko. Anbefaler antikoagulasjon."; colorClass = "score-high"; }
                    } else { 
                        if (score === 1) { interpretation = "Lav risiko. Ingen antikoagulasjon."; colorClass = "score-0"; }
                        else if (score === 2) { interpretation = "Moderat risiko. Vurder antikoagulasjon."; colorClass = "score-low"; }
                        else { interpretation = "Høy risiko. Anbefaler antikoagulasjon."; colorClass = "score-high"; }
                    }
                } else {
                    score = "-";
                    var missingC = calcC.totalRows - calcC.checkedCount;
                    if (!sexRadio) missingC++;
                    if (!ageRadio) missingC++;
                    interpretation = "Mangler svar på " + missingC + " punkt(er)";
                    if (missingC === calcC.totalRows + 2) interpretation = "Fyll inn felter...";
                    colorClass = "score-0";
                }

            } else if (currentTab === 'onews') {
                var o_resp = getNum('o_resp');
                var o_spo2 = getNum('o_spo2');
                var o_sbp = getNum('o_sbp');
                var o_dbp = getNum('o_dbp');
                var o_puls = getNum('o_puls');
                var o_temp = getNum('o_temp');

                var o_respS = 0, o_spo2S = 0, o_sbpS = 0, o_dbpS = 0, o_pulsS = 0, o_tempS = 0;

                if(!isNaN(o_resp)) { if (o_resp < 10) o_respS = 3; else if (o_resp <= 20) o_respS = 0; else if (o_resp <= 25) o_respS = 2; else o_respS = 3; }
                updateInputColor('o_resp', o_respS, isNaN(o_resp));

                if(!isNaN(o_spo2)) { if (o_spo2 < 96) o_spo2S = 3; else o_spo2S = 0; }
                updateInputColor('o_spo2', o_spo2S, isNaN(o_spo2));

                if(!isNaN(o_sbp)) { if (o_sbp < 90) o_sbpS = 3; else if (o_sbp <= 139) o_sbpS = 0; else if (o_sbp <= 149) o_sbpS = 1; else if (o_sbp <= 159) o_sbpS = 2; else o_sbpS = 3; }
                updateInputColor('o_sbp', o_sbpS, isNaN(o_sbp));

                if(!isNaN(o_dbp)) { if (o_dbp < 90) o_dbpS = 0; else if (o_dbp <= 99) o_dbpS = 1; else if (o_dbp <= 109) o_dbpS = 2; else o_dbpS = 3; }
                updateInputColor('o_dbp', o_dbpS, isNaN(o_dbp));

                if(!isNaN(o_puls)) { if (o_puls < 50) o_pulsS = 3; else if (o_puls <= 99) o_pulsS = 0; else if (o_puls <= 109) o_pulsS = 1; else if (o_puls <= 119) o_pulsS = 2; else o_pulsS = 3; }
                updateInputColor('o_puls', o_pulsS, isNaN(o_puls));

                if(!isNaN(o_temp)) { if (o_temp < 35.0) o_tempS = 3; else if (o_temp <= 35.9) o_tempS = 1; else if (o_temp <= 37.4) o_tempS = 0; else if (o_temp <= 37.9) o_tempS = 1; else o_tempS = 2; }
                updateInputColor('o_temp', o_tempS, isNaN(o_temp));

                score = o_respS + o_spo2S + o_sbpS + o_dbpS + o_pulsS + o_tempS;

                if (!isNaN(o_resp) || !isNaN(o_spo2) || !isNaN(o_sbp) || !isNaN(o_dbp) || !isNaN(o_puls) || !isNaN(o_temp)) {
                    if (score === 0) { interpretation = "Normal / Standard observasjon"; colorClass = "score-0"; }
                    else if (score >= 1 && score <= 4) { interpretation = "Økt observasjonsnivå, varsle ansvarlig."; colorClass = "score-low"; }
                    else if (score >= 5) { interpretation = "Alvorlig (Lege skal tilkalles straks)"; colorClass = "score-high"; }
                }

            } else if (currentTab === 'gcs') {
                var eRadio = document.querySelector('input[name="gcs_e"]:checked');
                var vRadio = document.querySelector('input[name="gcs_v"]:checked');
                var mRadio = document.querySelector('input[name="gcs_m"]:checked');

                if (eRadio && vRadio && mRadio) {
                    var e = parseInt(eRadio.value);
                    var v = parseInt(vRadio.value);
                    var m = parseInt(mRadio.value);
                    score = e + v + m;

                    if (score === 15) { interpretation = "Normal"; colorClass = "score-0"; }
                    else if (score >= 13) { interpretation = "Mild hjerneskade / mild TBI"; colorClass = "score-low"; }
                    else if (score >= 9) { interpretation = "Moderat hjerneskade / moderat TBI"; colorClass = "score-med"; }
                    else { interpretation = "Alvorlig hjerneskade / alvorlig TBI"; colorClass = "score-high"; }
                } else {
                    score = "-";
                    var missingG = 0;
                    if (!eRadio) missingG++;
                    if (!vRadio) missingG++;
                    if (!mRadio) missingG++;
                    interpretation = missingG === 3 ? "Fyll inn felter..." : "Mangler svar på " + missingG + " punkt(er)";
                    colorClass = "score-0";
                }

            } else if (currentTab === 'ciwa') {
                score = 0;
                var checkedCountCiwa = 0;
                var selects = document.querySelectorAll('#ciwa .ciwa-select');
                var totalRowsCiwa = selects.length;

                for(var q=0; q<selects.length; q++) {
                    var sel = selects[q];
                    if(sel.value !== "") {
                        checkedCountCiwa++;
                        score += parseInt(sel.value, 10);
                    }
                }

                if (checkedCountCiwa === totalRowsCiwa && totalRowsCiwa > 0) {
                    if (score < 10) { interpretation = "Mild abstinens"; colorClass = "score-0"; }
                    else if (score <= 15) { interpretation = "Moderat abstinens"; colorClass = "score-low"; }
                    else if (score <= 20) { interpretation = "Sterk abstinens"; colorClass = "score-med"; }
                    else { interpretation = "Alvorlig abstinens"; colorClass = "score-high"; }
                } else {
                    score = "-";
                    var missingCiwa = totalRowsCiwa - checkedCountCiwa;
                    interpretation = missingCiwa === totalRowsCiwa ? "Fyll inn felter..." : "Mangler svar på " + missingCiwa + " punkt(er)";
                    colorClass = "score-0";
                }

            } else if (currentTab === 'wells-dvt') {
                var calcD = calcChecklistScore('wells-dvt-form');
                if (calcD.checkedCount === calcD.totalRows && calcD.totalRows > 0) {
                    score = calcD.score;
                    if (score >= 2) { interpretation = "Sannsynlig DVT (≥ 2 poeng)"; colorClass = "score-high"; }
                    else { interpretation = "Usannsynlig DVT (< 2 poeng)"; colorClass = "score-0"; }
                } else {
                    score = "-";
                    var missingD = calcD.totalRows - calcD.checkedCount;
                    interpretation = missingD === calcD.totalRows ? "Fyll inn felter..." : "Mangler svar på " + missingD + " punkt(er)";
                    colorClass = "score-0";
                }


            }
            else if (currentTab === 'mantrel') {
                textToCopy = "[Mantrel Score Appendisitt] - " + getDate() + "\nScore: " + score + " - " + shortInterpretation + "\n\nPositive funn:\n";
                textToCopy += extractChecklistFindings('mantrel-form');
            }
            else if (currentTab === 'wells-le') {
                textToCopy = "[Wells Score Lungeemboli] - " + getDate() + "\nScore: " + score + " - " + shortInterpretation + "\n\nPositive funn:\n";
                textToCopy += extractChecklistFindings('wells-le-form');
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    showToast("Kopiert til utklippstavlen!");
                }).catch(function(err) {
                    fallbackCopyTextToClipboard(textToCopy);
                });
            } else {
                fallbackCopyTextToClipboard(textToCopy);
            }
        }

        function fallbackCopyTextToClipboard(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed"; // Unngå scrolling
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                currentRegistrationCopied = true;
                showToast("Kopiert til utklippstavlen!");
            } catch (err) {
                console.error('Fallback copy feilet', err);
            }
            document.body.removeChild(textArea);
        }

        function showToast(msg, isError) {
            isError = isError || false; // Fallback for eldre nettlesere
            var toast = document.getElementById('toast');
            toast.textContent = msg;
            
            if (isError) {
                toast.classList.add('toast-error');
            } else {
                toast.classList.remove('toast-error');
            }

            toast.style.transform = 'translateY(0)';
            setTimeout(function() {
                toast.style.transform = 'translateY(-200%)';
            }, isError ? 4000 : 3000);
        }
    


        var calculateScoreOriginal202605 = calculateScore;

        // --- KORRIGERINGER 2026-05: nivågrenser og fullstendighetskrav ---
        function updateInputColor(id, score, isInvalid) {
            var el = document.getElementById(id);
            if (!el) return;
            el.classList.remove('input-score-0', 'input-score-1', 'input-score-2', 'input-score-3');
            if (isInvalid || score === null || typeof score === 'undefined' || isNaN(score)) return;
            if (score <= 0) el.classList.add('input-score-0');
            else if (score === 1) el.classList.add('input-score-1');
            else if (score === 2) el.classList.add('input-score-2');
            else el.classList.add('input-score-3');
        }

        function calcNEWS2Resp(v) { if (isNaN(v)) return null; if (v <= 8) return 3; if (v <= 11) return 1; if (v <= 20) return 0; if (v <= 24) return 2; return 3; }
        function calcNEWS2SpO2(v, scale, o2) {
            if (isNaN(v)) return null;
            if (scale === '2') {
                if (v <= 83) return 3;
                if (v <= 85) return 2;
                if (v <= 87) return 1;
                if (v <= 92) return 0;
                if (o2 === 2) {
                    if (v <= 94) return 1;
                    if (v <= 96) return 2;
                    return 3;
                }
                return 0;
            }
            if (v <= 91) return 3;
            if (v <= 93) return 2;
            if (v <= 95) return 1;
            return 0;
        }
        function calcNEWS2BP(v) { if (isNaN(v)) return null; if (v <= 90) return 3; if (v <= 100) return 2; if (v <= 110) return 1; if (v <= 219) return 0; return 3; }
        function calcNEWS2Pulse(v) { if (isNaN(v)) return null; if (v <= 40) return 3; if (v <= 50) return 1; if (v <= 90) return 0; if (v <= 110) return 1; if (v <= 130) return 2; return 3; }
        function calcNEWS2Temp(v) { if (isNaN(v)) return null; if (v <= 35.0) return 3; if (v <= 36.0) return 1; if (v <= 38.0) return 0; if (v <= 39.0) return 1; return 2; }

        function calcONEWSResp(v) { if (isNaN(v)) return null; if (v <= 10) return 3; if (v <= 19) return 0; if (v <= 24) return 1; return 3; }
        function calcONEWSSpO2(v) { if (isNaN(v)) return null; return v < 96 ? 3 : 0; }
        function calcONEWSTemp(v) { if (isNaN(v)) return null; if (v <= 35.0) return 3; if (v <= 35.9) return 1; if (v <= 37.4) return 0; if (v <= 37.9) return 1; return 2; }
        function calcONEWSPulse(v) { if (isNaN(v)) return null; if (v <= 50) return 3; if (v <= 60) return 1; if (v <= 99) return 0; if (v <= 119) return 1; return 3; }
        function calcONEWSSBP(v) { if (isNaN(v)) return null; if (v < 90) return 3; if (v <= 99) return 1; if (v <= 139) return 0; if (v <= 159) return 1; return 3; }
        function calcONEWSDBP(v) { if (isNaN(v)) return null; if (v < 40) return 3; if (v <= 49) return 1; if (v <= 89) return 0; if (v <= 99) return 1; if (v <= 109) return 2; return 3; }

        function calcSpO2TEWS(v, o2With) {
            if (isNaN(v)) return null;
            if (o2With) return v < 90 ? 3 : 2;
            if (v < 90) return 3;
            if (v <= 95) return 1;
            return 0;
        }
        function calcKFTEWS(v) { if (isNaN(v)) return null; if (v <= 2) return 0; if (v === 3) return 1; return 2; }
        function calcTeenSBPTEWS(v) { if (isNaN(v)) return null; if (v <= 70) return 3; if (v <= 80) return 2; if (v <= 100) return 1; if (v <= 180) return 0; return 3; }
        function getTewsAgeGroup(ageVal, ageUnit) {
            if (isNaN(ageVal)) return -1;
            var m_age = ageUnit === 'y' ? ageVal * 12 : ageVal;
            if (m_age < 1) return 0;
            if (m_age < 12) return 1;
            if (m_age < 48) return 2;
            if (m_age < 84) return 3;
            if (m_age < 156) return 4;
            if (m_age < 192) return 5;
            return -2;
        }
        function setScoreDisplay(score, interpretation, colorClass) {
            var displayEl = document.getElementById('score-display');
            displayEl.textContent = score;
            displayEl.className = "score-circle " + colorClass;
            document.getElementById('score-interpretation').textContent = interpretation;
            if (typeof updateAdvancedNEWS2Button === 'function') updateAdvancedNEWS2Button(score);
}
        function setTriageInterpretation(score, hasSingleRed) {
            if (score <= 0) return { text: "Grønn - haster ikke", cls: "score-0" };
            if (score <= 2) return { text: "Gul - lege innen 2 timer", cls: "score-low" };
            if (score <= 4) return { text: hasSingleRed ? "Oransje - lege innen 10 min" : "Gul - lege innen 2 timer", cls: hasSingleRed ? "score-med" : "score-low" };
            if (score <= 6) return { text: "Oransje - lege innen 10 min", cls: "score-med" };
            return { text: "Rød - lege nå", cls: "score-high" };
        }
        function setTEWSInterpretation(score) {
            if (score <= 2) return { text: "Grønn/blå hastegrad - haster ikke", cls: "score-0" };
            if (score <= 4) return { text: "Gul hastegrad - lege innen 2 timer", cls: "score-low" };
            if (score <= 6) return { text: "Oransje hastegrad - lege innen 10 min", cls: "score-med" };
            return { text: "Rød hastegrad - lege nå", cls: "score-high" };
        }
        function allPresent(arr) {
            for (var i=0; i<arr.length; i++) {
                if (arr[i] === null || typeof arr[i] === 'undefined' || isNaN(arr[i])) return false;
            }
            return true;
        }

        function calculateScore() {
            var score = 0;
            var interpretation = "Fyll inn felter...";
            var colorClass = "score-0";

            if (currentTab === 'news2') {
                var resp = getNum('n2_resp'), spo2 = getNum('n2_spo2'), bp = getNum('n2_bp'), puls = getNum('n2_puls'), temp = getNum('n2_temp');
                var scale = document.getElementById('news2-scale').value;
                var o2Radio = document.querySelector('input[name="n2_o2"]:checked');
                var avpuRadio = document.querySelector('input[name="n2_avpu"]:checked');
                var o2 = o2Radio ? parseInt(o2Radio.value, 10) : null;
                var avpu = avpuRadio ? parseInt(avpuRadio.value, 10) : null;
                var respS = calcNEWS2Resp(resp), spo2S = calcNEWS2SpO2(spo2, scale, o2 || 0), bpS = calcNEWS2BP(bp), pulsS = calcNEWS2Pulse(puls), tempS = calcNEWS2Temp(temp);
                updateInputColor('n2_resp', respS, isNaN(resp));
                updateInputColor('n2_spo2', spo2S, isNaN(spo2));
                updateInputColor('n2_bp', bpS, isNaN(bp));
                updateInputColor('n2_puls', pulsS, isNaN(puls));
                updateInputColor('n2_temp', tempS, isNaN(temp));
                var completed = allPresent([resp, spo2, bp, puls, temp]) && o2Radio && avpuRadio;
                if (completed) {
                    score = respS + spo2S + bpS + pulsS + tempS + o2 + avpu;
                    var hasRed = respS === 3 || spo2S === 3 || bpS === 3 || pulsS === 3 || tempS === 3 || avpu === 3;
                    var triage = setTriageInterpretation(score, hasRed);
                    interpretation = triage.text; colorClass = triage.cls;
                } else {
                    score = "-";
                    var missing = 0;
                    if (isNaN(resp)) missing++;
                    if (isNaN(spo2)) missing++;
                    if (isNaN(bp)) missing++;
                    if (isNaN(puls)) missing++;
                    if (isNaN(temp)) missing++;
                    if (!o2Radio) missing++;
                    if (!avpuRadio) missing++;
                    interpretation = missing === 7 ? "Fyll inn felter..." : "Mangler svar på " + missing + " punkt(er)";
                }

            } else if (currentTab === 'onews') {
                var o_resp = getNum('o_resp'), o_spo2 = getNum('o_spo2'), o_sbp = getNum('o_sbp'), o_dbp = getNum('o_dbp'), o_puls = getNum('o_puls'), o_temp = getNum('o_temp');
                var o_respS = calcONEWSResp(o_resp), o_spo2S = calcONEWSSpO2(o_spo2), o_sbpS = calcONEWSSBP(o_sbp), o_dbpS = calcONEWSDBP(o_dbp), o_pulsS = calcONEWSPulse(o_puls), o_tempS = calcONEWSTemp(o_temp);
                updateInputColor('o_resp', o_respS, isNaN(o_resp));
                updateInputColor('o_spo2', o_spo2S, isNaN(o_spo2));
                updateInputColor('o_sbp', o_sbpS, isNaN(o_sbp));
                updateInputColor('o_dbp', o_dbpS, isNaN(o_dbp));
                updateInputColor('o_puls', o_pulsS, isNaN(o_puls));
                updateInputColor('o_temp', o_tempS, isNaN(o_temp));
                if (allPresent([o_resp, o_spo2, o_sbp, o_dbp, o_puls, o_temp])) {
                    score = o_respS + o_spo2S + o_sbpS + o_dbpS + o_pulsS + o_tempS;
                    var hasRedO = o_respS === 3 || o_spo2S === 3 || o_sbpS === 3 || o_dbpS === 3 || o_pulsS === 3 || o_tempS === 3;
                    var triageO = setTriageInterpretation(score, hasRedO);
                    interpretation = triageO.text; colorClass = triageO.cls;
                } else {
                    score = "-";
                    var missO = 0;
                    if (isNaN(o_resp)) missO++;
                    if (isNaN(o_spo2)) missO++;
                    if (isNaN(o_sbp)) missO++;
                    if (isNaN(o_dbp)) missO++;
                    if (isNaN(o_puls)) missO++;
                    if (isNaN(o_temp)) missO++;
                    interpretation = missO === 6 ? "Fyll inn felter..." : "Mangler svar på " + missO + " punkt(er)";
                }

            } else if (currentTab === 'tews') {
                var ageVal = getNum('tews-age-val');
                var ageUnit = document.getElementById('tews-age-unit').value;
                var ageGroup = getTewsAgeGroup(ageVal, ageUnit);
                if (ageGroup >= 0) document.getElementById('tews-active-group').innerText = "(" + tewsRanges[ageGroup].name + ")";
                else document.getElementById('tews-active-group').innerText = ageGroup === -2 ? "(TEWS barn gjelder t.o.m. 15 år)" : "";
                var kfCard = document.getElementById('tews-kf-card');
                var sbpCard = document.getElementById('tews-sbp-card');
                if (kfCard && sbpCard) {
                    kfCard.style.opacity = ageGroup === 5 ? "0.45" : "1";
                    sbpCard.style.opacity = ageGroup === 5 ? "1" : "0.45";
                }
                if (ageGroup >= 0) {
                    var rules = tewsRanges[ageGroup];
                    var t_resp = getNum('t_resp'), t_puls = getNum('t_puls'), t_spo2 = getNum('t_spo2'), t_temp = getNum('t_temp'), t_kf = getNum('t_kf'), t_sbp = getNum('t_sbp');
                    var t_o2Radio = document.querySelector('input[name="tews_o2"]:checked');
                    var t_avpuRadio = document.querySelector('input[name="tews_avpu"]:checked');
                    var t_mobRadio = document.querySelector('input[name="tews_mobility"]:checked');
                    var t_injRadio = document.querySelector('input[name="tews_injury"]:checked');

                    var t_respS = evalRule(t_resp, rules.resp);
                    var t_pulsS = evalRule(t_puls, rules.puls);
                    var t_spo2S = calcSpO2TEWS(t_spo2, t_o2Radio && t_o2Radio.value === "1");
                    var t_tempS = evalRule(t_temp, rules.temp);
                    var t_kfS = calcKFTEWS(t_kf);
                    var t_sbpS = calcTeenSBPTEWS(t_sbp);
                    updateInputColor('t_resp', t_respS, isNaN(t_resp));
                    updateInputColor('t_puls', t_pulsS, isNaN(t_puls));
                    updateInputColor('t_spo2', t_spo2S, isNaN(t_spo2));
                    updateInputColor('t_temp', t_tempS, isNaN(t_temp));
                    updateInputColor('t_kf', t_kfS, isNaN(t_kf) || ageGroup === 5);
                    updateInputColor('t_sbp', t_sbpS, isNaN(t_sbp) || ageGroup !== 5);

                    var useTeenSBP = ageGroup === 5;
                    var completeVitals = allPresent([t_resp, t_puls, t_spo2, t_temp]) && t_o2Radio && t_avpuRadio && t_mobRadio && t_injRadio;
                    if (useTeenSBP) completeVitals = completeVitals && !isNaN(t_sbp);
                    else completeVitals = completeVitals && !isNaN(t_kf);

                    if (completeVitals) {
                        var avpuS = parseInt(t_avpuRadio.value, 10);
                        var mobS = parseInt(t_mobRadio.value, 10);
                        var injS = parseInt(t_injRadio.value, 10);
                        score = t_respS + t_pulsS + t_spo2S + t_tempS + avpuS + mobS + injS + (useTeenSBP ? t_sbpS : t_kfS);
                        var ti = setTEWSInterpretation(score);
                        interpretation = ti.text; colorClass = ti.cls;
                    } else {
                        score = "-";
                        var missingT = 0;
                        if (isNaN(t_resp)) missingT++;
                        if (isNaN(t_puls)) missingT++;
                        if (isNaN(t_spo2)) missingT++;
                        if (isNaN(t_temp)) missingT++;
                        if (!t_o2Radio) missingT++;
                        if (!t_avpuRadio) missingT++;
                        if (!t_mobRadio) missingT++;
                        if (!t_injRadio) missingT++;
                        if (useTeenSBP) { if (isNaN(t_sbp)) missingT++; }
                        else { if (isNaN(t_kf)) missingT++; }
                        interpretation = missingT === 9 ? "Fyll inn felter..." : "Mangler svar på " + missingT + " punkt(er)";
                    }
                } else {
                    score = "-";
                    updateInputColor('t_resp', null, true);
                    updateInputColor('t_puls', null, true);
                    updateInputColor('t_spo2', null, true);
                    updateInputColor('t_temp', null, true);
                    updateInputColor('t_kf', null, true);
                    updateInputColor('t_sbp', null, true);
                }

            } else {
                return calculateScoreOriginal202605 ? calculateScoreOriginal202605() : null;
            }
            setScoreDisplay(score, interpretation, colorClass);
        }

        // --- Siste overstyring: tastaturnavigasjon, aktive TEWS-felt og fullstendighetskrav ---
        function getChoiceLabelsForInput(input) {
            if (!input || !input.name) return [];
            var inputs = document.querySelectorAll('input[name="' + input.name + '"]');
            var group = [];
            for (var i = 0; i < inputs.length; i++) {
                var lbl = document.querySelector('label[for="' + inputs[i].id + '"]');
                if (lbl && !inputs[i].disabled && isElementVisible(lbl)) group.push(lbl);
            }
            return group;
        }

        function updateInputColor(id, score, isInvalid) {
            var el = document.getElementById(id);
            if (!el) return;
            el.classList.remove('input-score-0', 'input-score-1', 'input-score-2', 'input-score-3');
            if (isInvalid || score === null || typeof score === 'undefined' || isNaN(score)) return;
            if (score <= 0) el.classList.add('input-score-0');
            else if (score === 1) el.classList.add('input-score-1');
            else if (score === 2) el.classList.add('input-score-2');
            else el.classList.add('input-score-3');
        }

        function calcNEWS2Resp(v) { if (isNaN(v)) return null; if (v <= 8) return 3; if (v <= 11) return 1; if (v <= 20) return 0; if (v <= 24) return 2; return 3; }
        function calcNEWS2SpO2(v, scale, o2) {
            if (isNaN(v)) return null;
            if (scale === '2') {
                if (v <= 83) return 3;
                if (v <= 85) return 2;
                if (v <= 87) return 1;
                if (v <= 92) return 0;
                if (o2 === 2) {
                    if (v <= 94) return 1;
                    if (v <= 96) return 2;
                    return 3;
                }
                return 0;
            }
            if (v <= 91) return 3;
            if (v <= 93) return 2;
            if (v <= 95) return 1;
            return 0;
        }
        function calcNEWS2BP(v) { if (isNaN(v)) return null; if (v <= 90) return 3; if (v <= 100) return 2; if (v <= 110) return 1; if (v <= 219) return 0; return 3; }
        function calcNEWS2Pulse(v) { if (isNaN(v)) return null; if (v <= 40) return 3; if (v <= 50) return 1; if (v <= 90) return 0; if (v <= 110) return 1; if (v <= 130) return 2; return 3; }
        function calcNEWS2Temp(v) { if (isNaN(v)) return null; if (v <= 35.0) return 3; if (v <= 36.0) return 1; if (v <= 38.0) return 0; if (v <= 39.0) return 1; return 2; }
        function calcONEWSResp(v) { if (isNaN(v)) return null; if (v <= 10) return 3; if (v <= 19) return 0; if (v <= 24) return 1; return 3; }
        function calcONEWSSpO2(v) { if (isNaN(v)) return null; return v < 96 ? 3 : 0; }
        function calcONEWSTemp(v) { if (isNaN(v)) return null; if (v <= 35.0) return 3; if (v <= 35.9) return 1; if (v <= 37.4) return 0; if (v <= 37.9) return 1; return 2; }
        function calcONEWSPulse(v) { if (isNaN(v)) return null; if (v <= 50) return 3; if (v <= 60) return 1; if (v <= 99) return 0; if (v <= 119) return 1; return 3; }
        function calcONEWSSBP(v) { if (isNaN(v)) return null; if (v < 90) return 3; if (v <= 99) return 1; if (v <= 139) return 0; if (v <= 159) return 1; return 3; }
        function calcONEWSDBP(v) { if (isNaN(v)) return null; if (v < 40) return 3; if (v <= 49) return 1; if (v <= 89) return 0; if (v <= 99) return 1; if (v <= 109) return 2; return 3; }
        function calcSpO2TEWS(v, o2With) {
            if (isNaN(v)) return null;
            if (o2With) return v < 90 ? 3 : 2;
            if (v < 90) return 3;
            if (v <= 95) return 1;
            return 0;
        }
        function calcKFTEWS(v) { if (isNaN(v)) return null; if (v <= 2) return 0; if (v === 3) return 1; return 2; }
        function calcTeenSBPTEWS(v) { if (isNaN(v)) return null; if (v <= 70) return 3; if (v <= 80) return 2; if (v <= 100) return 1; if (v <= 180) return 0; return 3; }
        function getTewsAgeGroup(ageVal, ageUnit) {
            if (isNaN(ageVal)) return -1;
            var mAge = ageUnit === 'y' ? ageVal * 12 : ageVal;
            if (mAge < 1) return 0;
            if (mAge < 12) return 1;
            if (mAge < 48) return 2;
            if (mAge < 84) return 3;
            if (mAge < 156) return 4;
            if (mAge < 192) return 5;
            return -2;
        }
        function setScoreDisplay(score, interpretation, colorClass) {
            var displayEl = document.getElementById('score-display');
            displayEl.textContent = score;
            displayEl.className = "score-circle " + colorClass;
            document.getElementById('score-interpretation').textContent = interpretation;
            if (typeof updateAdvancedNEWS2Button === 'function') updateAdvancedNEWS2Button(score);
            updateCopyButtonState(score);
            updateScoreBreakdownTooltip();
        }

        function setTriageInterpretation(score, hasSingleRed) {
            if (score <= 0) return { text: "Grønn - haster ikke", cls: "score-0" };
            if (score <= 2) return { text: "Gul - lege innen 2 timer", cls: "score-low" };
            if (score <= 4) return { text: hasSingleRed ? "Oransje - lege innen 10 min" : "Gul - lege innen 2 timer", cls: hasSingleRed ? "score-med" : "score-low" };
            if (score <= 6) return { text: "Oransje - lege innen 10 min", cls: "score-med" };
            return { text: "Rød - lege nå", cls: "score-high" };
        }
        function setTEWSInterpretation(score) {
            if (score <= 2) return { text: "Grønn/blå hastegrad - haster ikke", cls: "score-0" };
            if (score <= 4) return { text: "Gul hastegrad - lege innen 2 timer", cls: "score-low" };
            if (score <= 6) return { text: "Oransje hastegrad - lege innen 10 min", cls: "score-med" };
            return { text: "Rød hastegrad - lege nå", cls: "score-high" };
        }
        function allPresent(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === null || typeof arr[i] === 'undefined' || isNaN(arr[i])) return false;
            }
            return true;
        }
        function buildMissingText(missing, total) {
            return missing === total ? "Fyll inn felter..." : "Mangler svar på " + missing + " punkt(er)";
        }
        function getCheckedRadio(name) {
            return document.querySelector('input[name="' + name + '"]:checked');
        }
        function sumSelectValues(selector) {
            var selects = document.querySelectorAll(selector);
            var score = 0;
            var filled = 0;
            for (var i = 0; i < selects.length; i++) {
                if (selects[i].value !== "") {
                    filled++;
                    score += parseInt(selects[i].value, 10);
                }
            }
            return { score: score, filled: filled, total: selects.length };
        }

        function updateCopyButtonState(score) {
            var btn = document.getElementById('copy-btn');
            if (!btn) return;
            currentScoreComplete = score !== "-" && score !== null && typeof score !== 'undefined' && (currentTab === 'qsofa' || !isNaN(score));
            btn.disabled = !currentScoreComplete;
            btn.setAttribute('aria-disabled', currentScoreComplete ? 'false' : 'true');
            btn.classList.toggle('copy-btn-ready', currentScoreComplete);
        }

        function setQsofaNews2PanelVisible(show) {
            var panel = document.getElementById('qsofa-news2-panel');
            if (panel) panel.classList.toggle('hidden', !show);
            var advice = document.getElementById('qsofa-news2-advice');
            if (advice && !show) advice.textContent = '';
            if (!show) {
                var ids = ['qsn_resp', 'qsn_spo2', 'qsn_bp', 'qsn_puls', 'qsn_temp'];
                for (var i = 0; i < ids.length; i++) updateInputColor(ids[i], null, true);
            }
        }

        function getQsofaNews2State() {
            var resp = getNum('qsn_resp');
            var spo2 = getNum('qsn_spo2');
            var bp = getNum('qsn_bp');
            var puls = getNum('qsn_puls');
            var temp = getNum('qsn_temp');
            var scaleEl = document.getElementById('qsn_scale');
            var scale = scaleEl ? scaleEl.value : '1';
            var o2Radio = getCheckedRadio('qsn_o2');
            var avpuRadio = getCheckedRadio('qsn_avpu');
            var o2 = o2Radio ? parseInt(o2Radio.value, 10) : null;
            var avpu = avpuRadio ? parseInt(avpuRadio.value, 10) : null;
            var respS = calcNEWS2Resp(resp);
            var spo2S = calcNEWS2SpO2(spo2, scale, o2 || 0);
            var bpS = calcNEWS2BP(bp);
            var pulsS = calcNEWS2Pulse(puls);
            var tempS = calcNEWS2Temp(temp);
            updateInputColor('qsn_resp', respS, isNaN(resp));
            updateInputColor('qsn_spo2', spo2S, isNaN(spo2));
            updateInputColor('qsn_bp', bpS, isNaN(bp));
            updateInputColor('qsn_puls', pulsS, isNaN(puls));
            updateInputColor('qsn_temp', tempS, isNaN(temp));
            var missing = 0;
            if (isNaN(resp)) missing++;
            if (isNaN(spo2)) missing++;
            if (isNaN(bp)) missing++;
            if (isNaN(puls)) missing++;
            if (isNaN(temp)) missing++;
            if (!o2Radio) missing++;
            if (!avpuRadio) missing++;
            var complete = missing === 0;
            var newsScore = complete ? respS + spo2S + bpS + pulsS + tempS + o2 + avpu : null;
            var hasRed = complete && (respS === 3 || spo2S === 3 || bpS === 3 || pulsS === 3 || tempS === 3 || avpu === 3);
            return { complete: complete, missing: missing, score: newsScore, hasRed: hasRed };
        }

        function setQsofaNews2Advice(text, tone) {
            var advice = document.getElementById('qsofa-news2-advice');
            if (!advice) return;
            advice.className = 'qsofa-news2-advice ' + (tone || '');
            advice.textContent = text || '';
        }

        function calculateScore() {
            var score = "-";
            var interpretation = "Fyll inn felter...";
            var colorClass = "score-0";

            if (currentTab === 'news2') {
                var resp = getNum('n2_resp');
                var spo2 = getNum('n2_spo2');
                var bp = getNum('n2_bp');
                var puls = getNum('n2_puls');
                var temp = getNum('n2_temp');
                var scale = document.getElementById('news2-scale').value;
                var o2Radio = getCheckedRadio('n2_o2');
                var avpuRadio = getCheckedRadio('n2_avpu');
                var o2 = o2Radio ? parseInt(o2Radio.value, 10) : null;
                var avpu = avpuRadio ? parseInt(avpuRadio.value, 10) : null;
                var respS = calcNEWS2Resp(resp);
                var spo2S = calcNEWS2SpO2(spo2, scale, o2 || 0);
                var bpS = calcNEWS2BP(bp);
                var pulsS = calcNEWS2Pulse(puls);
                var tempS = calcNEWS2Temp(temp);
                updateInputColor('n2_resp', respS, isNaN(resp));
                updateInputColor('n2_spo2', spo2S, isNaN(spo2));
                updateInputColor('n2_bp', bpS, isNaN(bp));
                updateInputColor('n2_puls', pulsS, isNaN(puls));
                updateInputColor('n2_temp', tempS, isNaN(temp));
                if (allPresent([resp, spo2, bp, puls, temp]) && o2Radio && avpuRadio) {
                    score = respS + spo2S + bpS + pulsS + tempS + o2 + avpu;
                    var hasRed = respS === 3 || spo2S === 3 || bpS === 3 || pulsS === 3 || tempS === 3 || avpu === 3;
                    var triage = setTriageInterpretation(score, hasRed);
                    interpretation = triage.text;
                    colorClass = triage.cls;
                } else {
                    var missingNews2 = 0;
                    if (isNaN(resp)) missingNews2++;
                    if (isNaN(spo2)) missingNews2++;
                    if (isNaN(bp)) missingNews2++;
                    if (isNaN(puls)) missingNews2++;
                    if (isNaN(temp)) missingNews2++;
                    if (!o2Radio) missingNews2++;
                    if (!avpuRadio) missingNews2++;
                    interpretation = buildMissingText(missingNews2, 7);
                }
            } else if (currentTab === 'onews') {
                var oResp = getNum('o_resp');
                var oSpo2 = getNum('o_spo2');
                var oSbp = getNum('o_sbp');
                var oDbp = getNum('o_dbp');
                var oPuls = getNum('o_puls');
                var oTemp = getNum('o_temp');
                var oRespS = calcONEWSResp(oResp);
                var oSpo2S = calcONEWSSpO2(oSpo2);
                var oSbpS = calcONEWSSBP(oSbp);
                var oDbpS = calcONEWSDBP(oDbp);
                var oPulsS = calcONEWSPulse(oPuls);
                var oTempS = calcONEWSTemp(oTemp);
                updateInputColor('o_resp', oRespS, isNaN(oResp));
                updateInputColor('o_spo2', oSpo2S, isNaN(oSpo2));
                updateInputColor('o_sbp', oSbpS, isNaN(oSbp));
                updateInputColor('o_dbp', oDbpS, isNaN(oDbp));
                updateInputColor('o_puls', oPulsS, isNaN(oPuls));
                updateInputColor('o_temp', oTempS, isNaN(oTemp));
                if (allPresent([oResp, oSpo2, oSbp, oDbp, oPuls, oTemp])) {
                    score = oRespS + oSpo2S + oSbpS + oDbpS + oPulsS + oTempS;
                    var hasRedO = oRespS === 3 || oSpo2S === 3 || oSbpS === 3 || oDbpS === 3 || oPulsS === 3 || oTempS === 3;
                    var triageO = setTriageInterpretation(score, hasRedO);
                    interpretation = triageO.text;
                    colorClass = triageO.cls;
                } else {
                    var missingOnews = 0;
                    if (isNaN(oResp)) missingOnews++;
                    if (isNaN(oSpo2)) missingOnews++;
                    if (isNaN(oSbp)) missingOnews++;
                    if (isNaN(oDbp)) missingOnews++;
                    if (isNaN(oPuls)) missingOnews++;
                    if (isNaN(oTemp)) missingOnews++;
                    interpretation = buildMissingText(missingOnews, 6);
                }
            } else if (currentTab === 'tews') {
                var ageVal = getNum('tews-age-val');
                var ageUnit = document.getElementById('tews-age-unit').value;
                var ageGroup = getTewsAgeGroup(ageVal, ageUnit);
                if (ageGroup >= 0) document.getElementById('tews-active-group').innerText = "(" + tewsRanges[ageGroup].name + ")";
                else document.getElementById('tews-active-group').innerText = ageGroup === -2 ? "(TEWS barn gjelder t.o.m. 15 år)" : "";
                syncTEWSFieldState(ageGroup);
                if (ageGroup >= 0) {
                    var rules = tewsRanges[ageGroup];
                    var tResp = getNum('t_resp');
                    var tPuls = getNum('t_puls');
                    var tSpo2 = getNum('t_spo2');
                    var tTemp = getNum('t_temp');
                    var tKf = getNum('t_kf');
                    var tSbp = getNum('t_sbp');
                    var tO2Radio = getCheckedRadio('tews_o2');
                    var tAvpuRadio = getCheckedRadio('tews_avpu');
                    var tMobRadio = getCheckedRadio('tews_mobility');
                    var tInjRadio = getCheckedRadio('tews_injury');
                    var useTeenSBP = ageGroup === 5;
                    var tRespS = evalRule(tResp, rules.resp);
                    var tPulsS = evalRule(tPuls, rules.puls);
                    var tSpo2S = calcSpO2TEWS(tSpo2, tO2Radio && tO2Radio.value === "1");
                    var tTempS = evalRule(tTemp, rules.temp);
                    var tKfS = calcKFTEWS(tKf);
                    var tSbpS = calcTeenSBPTEWS(tSbp);
                    updateInputColor('t_resp', tRespS, isNaN(tResp));
                    updateInputColor('t_puls', tPulsS, isNaN(tPuls));
                    updateInputColor('t_spo2', tSpo2S, isNaN(tSpo2));
                    updateInputColor('t_temp', tTempS, isNaN(tTemp));
                    updateInputColor('t_kf', tKfS, isNaN(tKf) || useTeenSBP);
                    updateInputColor('t_sbp', tSbpS, isNaN(tSbp) || !useTeenSBP);
                    var completeTEWS = allPresent([tResp, tPuls, tSpo2, tTemp]) && tO2Radio && tAvpuRadio && tMobRadio && tInjRadio;
                    if (useTeenSBP) completeTEWS = completeTEWS && !isNaN(tSbp);
                    else completeTEWS = completeTEWS && !isNaN(tKf);
                    if (completeTEWS) {
                        var avpuS = parseInt(tAvpuRadio.value, 10);
                        var mobS = parseInt(tMobRadio.value, 10);
                        var injS = parseInt(tInjRadio.value, 10);
                        score = tRespS + tPulsS + tSpo2S + tTempS + avpuS + mobS + injS + (useTeenSBP ? tSbpS : tKfS);
                        var triageTews = setTEWSInterpretation(score);
                        interpretation = triageTews.text;
                        colorClass = triageTews.cls;
                    } else {
                        var missingTews = 0;
                        if (isNaN(ageVal)) missingTews++;
                        if (isNaN(tResp)) missingTews++;
                        if (isNaN(tPuls)) missingTews++;
                        if (isNaN(tSpo2)) missingTews++;
                        if (isNaN(tTemp)) missingTews++;
                        if (!tO2Radio) missingTews++;
                        if (!tAvpuRadio) missingTews++;
                        if (!tMobRadio) missingTews++;
                        if (!tInjRadio) missingTews++;
                        if (useTeenSBP) { if (isNaN(tSbp)) missingTews++; } else if (isNaN(tKf)) missingTews++;
                        interpretation = buildMissingText(missingTews, 10);
                    }
                } else {
                    updateInputColor('t_resp', null, true);
                    updateInputColor('t_puls', null, true);
                    updateInputColor('t_spo2', null, true);
                    updateInputColor('t_temp', null, true);
                    updateInputColor('t_kf', null, true);
                    updateInputColor('t_sbp', null, true);
                    interpretation = isNaN(ageVal) ? "Fyll inn felter..." : "TEWS barn gjelder t.o.m. 15 år";
                }
            } else if (currentTab === 'qsofa') {
                var calcQ = calcChecklistScore('qsofa-form');
                if (calcQ.checkedCount === calcQ.totalRows && calcQ.totalRows > 0) {
                    score = calcQ.score;
                    if (score < 2) {
                        setQsofaNews2PanelVisible(false);
                        interpretation = "Lav risiko for sepsis-relatert dårlig utfall";
                        colorClass = "score-0";
                    } else {
                        setQsofaNews2PanelVisible(true);
                        var qNews2 = getQsofaNews2State();
                        if (qNews2.complete) {
                            score = calcQ.score + "/" + qNews2.score;
                            var qTriage2 = setTriageInterpretation(qNews2.score, qNews2.hasRed);
                            interpretation = "qSOFA ≥ 2. NEWS2: " + qTriage2.text;
                            colorClass = qNews2.score >= 5 || qNews2.hasRed ? "score-high" : qTriage2.cls;
                            if (qNews2.score >= 5 || qNews2.hasRed) setQsofaNews2Advice("Høy risiko ved mistenkt sepsis. Vurder rask legetilsyn og videre sepsishåndtering.", "bad");
                            else setQsofaNews2Advice("qSOFA er positiv. NEWS2 er lavere, men klinisk mistanke om sepsis skal fortsatt vurderes og målinger bør gjentas ved forverring.", "warn");
                        } else {
                            score = "-";
                            interpretation = "qSOFA ≥ 2. Fyll inn NEWS2 for videre risikovurdering.";
                            colorClass = "score-high";
                            setQsofaNews2Advice("Fyll inn felter i NEWS2 ved mistanke om sepsis.", "warn");
                        }
                    }
                } else {
                    interpretation = buildMissingText(calcQ.totalRows - calcQ.checkedCount, calcQ.totalRows);
                    setQsofaNews2PanelVisible(false);
                }
            } else if (currentTab === 'chads') {
                var calcChads = calcChecklistScore('chads-form');
                var sexRadio = getCheckedRadio('chads_sex');
                var ageRadio = getCheckedRadio('chads_age');
                if (calcChads.checkedCount === calcChads.totalRows && calcChads.totalRows > 0 && sexRadio && ageRadio) {
                    var sexScore = parseInt(sexRadio.value, 10);
                    var ageScore = parseInt(ageRadio.value, 10);
                    score = calcChads.score + sexScore + ageScore;
                    if (sexScore === 0) interpretation = score === 0 ? "Lav risiko. Ingen antikoagulasjon." : (score === 1 ? "Moderat risiko. Vurder antikoagulasjon." : "Høy risiko. Anbefaler antikoagulasjon.");
                    else interpretation = score === 1 ? "Lav risiko. Ingen antikoagulasjon." : (score === 2 ? "Moderat risiko. Vurder antikoagulasjon." : "Høy risiko. Anbefaler antikoagulasjon.");
                    colorClass = score <= 1 ? "score-0" : (score === 2 ? "score-low" : "score-high");
                } else {
                    var missingChads = calcChads.totalRows - calcChads.checkedCount;
                    if (!sexRadio) missingChads++;
                    if (!ageRadio) missingChads++;
                    interpretation = buildMissingText(missingChads, calcChads.totalRows + 2);
                }
            } else if (currentTab === 'gcs') {
                var eRadio = getCheckedRadio('gcs_e');
                var vRadio = getCheckedRadio('gcs_v');
                var mRadio = getCheckedRadio('gcs_m');
                if (eRadio && vRadio && mRadio) {
                    score = parseInt(eRadio.value, 10) + parseInt(vRadio.value, 10) + parseInt(mRadio.value, 10);
                    if (score === 15) { interpretation = "Normal"; colorClass = "score-0"; }
                    else if (score >= 13) { interpretation = "Mild hjerneskade / mild TBI"; colorClass = "score-low"; }
                    else if (score >= 9) { interpretation = "Moderat hjerneskade / moderat TBI"; colorClass = "score-med"; }
                    else { interpretation = "Alvorlig hjerneskade / alvorlig TBI"; colorClass = "score-high"; }
                } else {
                    var missingGcs = 0;
                    if (!eRadio) missingGcs++;
                    if (!vRadio) missingGcs++;
                    if (!mRadio) missingGcs++;
                    interpretation = buildMissingText(missingGcs, 3);
                }
            } else if (currentTab === 'ciwa') {
                var calcCiwa = sumSelectValues('#ciwa .ciwa-select');
                if (calcCiwa.filled === calcCiwa.total && calcCiwa.total > 0) {
                    score = calcCiwa.score;
                    if (score < 10) { interpretation = "Mild abstinens"; colorClass = "score-0"; }
                    else if (score <= 15) { interpretation = "Moderat abstinens"; colorClass = "score-low"; }
                    else if (score <= 20) { interpretation = "Sterk abstinens"; colorClass = "score-med"; }
                    else { interpretation = "Alvorlig abstinens"; colorClass = "score-high"; }
                } else {
                    interpretation = buildMissingText(calcCiwa.total - calcCiwa.filled, calcCiwa.total);
                }
            } else if (currentTab === 'wells-dvt') {
                var calcDvt = calcChecklistScore('wells-dvt-form');
                if (calcDvt.checkedCount === calcDvt.totalRows && calcDvt.totalRows > 0) {
                    score = calcDvt.score;
                    interpretation = score >= 2 ? "Sannsynlig DVT (≥ 2 poeng)" : "Usannsynlig DVT (< 2 poeng)";
                    colorClass = score >= 2 ? "score-high" : "score-0";
                } else {
                    interpretation = buildMissingText(calcDvt.totalRows - calcDvt.checkedCount, calcDvt.totalRows);
                }
            } else if (currentTab === 'wells-le') {
                var calcLe = calcChecklistScore('wells-le-form');
                if (calcLe.checkedCount === calcLe.totalRows && calcLe.totalRows > 0) {
                    score = calcLe.score;
                    interpretation = score > 4 ? "LE sannsynlig (> 4 poeng)" : "LE lite sannsynlig (≤ 4 poeng)";
                    colorClass = score > 4 ? "score-high" : "score-0";
                } else {
                    interpretation = buildMissingText(calcLe.totalRows - calcLe.checkedCount, calcLe.totalRows);
                }
            } else if (currentTab === 'curb65') {
                var calcCurb = calcChecklistScore('curb65-form');
                if (calcCurb.checkedCount === calcCurb.totalRows && calcCurb.totalRows > 0) {
                    score = calcCurb.score;
                    if (score === 0) { interpretation = "Lav risiko"; colorClass = "score-0"; }
                    else if (score <= 2) { interpretation = "Moderat risiko"; colorClass = "score-low"; }
                    else { interpretation = "Høy risiko"; colorClass = "score-high"; }
                } else {
                    interpretation = buildMissingText(calcCurb.totalRows - calcCurb.checkedCount, calcCurb.totalRows);
                }
            } else if (currentTab === 'nihss') {
                var calcNihss = sumSelectValues('#nihss .ciwa-select');
                if (calcNihss.filled === calcNihss.total && calcNihss.total > 0) {
                    score = calcNihss.score;
                    if (score === 0) { interpretation = "Ingen nevrologiske utfall"; colorClass = "score-0"; }
                    else if (score <= 4) { interpretation = "Mildt slag"; colorClass = "score-low"; }
                    else if (score <= 15) { interpretation = "Moderat slag"; colorClass = "score-med"; }
                    else if (score <= 20) { interpretation = "Moderat til alvorlig slag"; colorClass = "score-med"; }
                    else { interpretation = "Alvorlig slag"; colorClass = "score-high"; }
                } else {
                    interpretation = buildMissingText(calcNihss.total - calcNihss.filled, calcNihss.total);
                }
            } else if (currentTab === 'abcd2') {
                var abcdRisk = calcChecklistScore('abcd-risk-form');
                var abcdSbp = getNum('abcd_sbp');
                var abcdDbp = getNum('abcd_dbp');
                var abcdBpFilled = !isNaN(abcdSbp) && !isNaN(abcdDbp);
                var abcdBpScore = abcdBpFilled && (abcdSbp >= 140 || abcdDbp >= 90) ? 1 : 0;
                var abcdScore = abcdRisk.score + abcdBpScore;
                var abcdExtraNames = ['abcd_clin', 'abcd_duration'];
                var abcdExtraFilled = 0;
                for (var a = 0; a < abcdExtraNames.length; a++) {
                    var abcdRadio = getCheckedRadio(abcdExtraNames[a]);
                    if (abcdRadio) {
                        abcdExtraFilled++;
                        abcdScore += parseInt(abcdRadio.value, 10);
                    }
                }
                var abcdTotalFields = abcdRisk.totalRows + 1 + abcdExtraNames.length;
                var abcdFilled = abcdRisk.checkedCount + (abcdBpFilled ? 1 : 0) + abcdExtraFilled;
                if (abcdFilled === abcdTotalFields) {
                    score = abcdScore;
                    if (score <= 3) { interpretation = "Lav risiko"; colorClass = "score-0"; }
                    else if (score <= 5) { interpretation = "Moderat risiko"; colorClass = "score-low"; }
                    else { interpretation = "Høy risiko"; colorClass = "score-high"; }
                } else {
                    interpretation = buildMissingText(abcdTotalFields - abcdFilled, abcdTotalFields);
                }
            } else if (currentTab === 'mantrel') {
                var calcMantrel = calcChecklistScore('mantrel-form');
                if (calcMantrel.checkedCount === calcMantrel.totalRows && calcMantrel.totalRows > 0) {
                    score = calcMantrel.score;
                    if (score <= 4) { interpretation = "Lav sannsynlighet for appendisitt"; colorClass = "score-0"; }
                    else if (score <= 6) { interpretation = "Forenlig med appendisitt"; colorClass = "score-low"; }
                    else if (score <= 8) { interpretation = "Sannsynlig appendisitt"; colorClass = "score-med"; }
                    else { interpretation = "Høy sannsynlighet for appendisitt"; colorClass = "score-high"; }
                } else {
                    interpretation = buildMissingText(calcMantrel.totalRows - calcMantrel.checkedCount, calcMantrel.totalRows);
                }
            }

            syncChoiceTabState();
            setScoreDisplay(score, interpretation, colorClass);
        }

        function formatCopyDate() {
            var now = new Date();
            function pad(value) { return value < 10 ? '0' + value : '' + value; }
            return pad(now.getDate()) + '.' + pad(now.getMonth() + 1) + '.' + now.getFullYear() + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
        }

        function getCurrentTabTitle() {
            var activeBtn = document.querySelector('.tab-btn.active');
            return activeBtn ? activeBtn.textContent.trim() : 'Score';
        }

        function getCheckedLabelText(input) {
            if (!input || !input.id) return '';
            var label = document.querySelector('label[for="' + input.id + '"]');
            if (!label) return input.value;
            var clone = label.cloneNode(true);
            var badges = clone.querySelectorAll('.choice-point-badge');
            for (var i = 0; i < badges.length; i++) badges[i].remove();
            return clone.textContent.replace(/\s+/g, ' ').trim();
        }

        function formatPointValue(value) {
            var num = parseFloat(value);
            if (isNaN(num)) return value + ' poeng';
            return (num % 1 === 0 ? String(num) : String(num).replace('.', ',')) + ' poeng';
        }

        function formatBreakdownLine(label, value, points) {
            return label + (value ? ': ' + value : '') + ' = ' + formatPointValue(points);
        }

        function getTextValueWithUnit(id) {
            var input = document.getElementById(id);
            if (!input || input.value === '') return '';
            var card = input.closest('.input-card');
            var unit = card ? card.querySelector('.input-unit') : null;
            return input.value + (unit ? ' ' + unit.textContent.trim() : '');
        }

        function getCardLabelByInputName(name) {
            var input = getCheckedRadio(name);
            if (!input) return '';
            var card = input.closest('.input-card');
            var label = card ? card.querySelector('.label') : null;
            return label ? label.textContent.replace(/\s+/g, ' ').trim() : '';
        }

        function getCheckedRadioBreakdown(name, labelOverride) {
            var input = getCheckedRadio(name);
            if (!input) return null;
            return formatBreakdownLine(labelOverride || getCardLabelByInputName(name), getCheckedLabelText(input), input.value);
        }

        function getSelectBreakdownLines(selector) {
            var lines = [];
            var selects = document.querySelectorAll(selector);
            for (var i = 0; i < selects.length; i++) {
                var select = selects[i];
                if (select.value === '') continue;
                var card = select.closest('.input-card');
                var label = card ? card.querySelector('.label') : null;
                var title = label ? label.textContent.replace(/\s+/g, ' ').trim() : select.id;
                lines.push(formatBreakdownLine(title, select.options[select.selectedIndex].text.trim(), select.value));
            }
            return lines;
        }

        function getChecklistBreakdownLines(containerId) {
            var lines = [];
            var container = document.getElementById(containerId);
            if (!container) return lines;
            var rows = container.querySelectorAll('.wells-row');
            for (var i = 0; i < rows.length; i++) {
                var checked = rows[i].querySelector('input[type="radio"]:checked, input[type="checkbox"]:checked');
                if (!checked) continue;
                var text = rows[i].querySelector('.wells-text');
                var label = text ? text.textContent.replace(/\s+/g, ' ').trim() : checked.name;
                lines.push(formatBreakdownLine(label, getCheckedLabelText(checked), checked.value));
            }
            return lines;
        }

        function getAbcdBreakdownLines() {
            var lines = getChecklistBreakdownLines('abcd-risk-form');
            var sbp = getNum('abcd_sbp');
            var dbp = getNum('abcd_dbp');
            if (!isNaN(sbp) && !isNaN(dbp)) {
                var bpScore = (sbp >= 140 || dbp >= 90) ? 1 : 0;
                lines.push(formatBreakdownLine('Blodtrykk', sbp + '/' + dbp + ' mmHg', bpScore));
            }
            var fields = [
                { name: 'abcd_duration', label: 'Varighet' },
                { name: 'abcd_clin', label: 'Kliniske trekk' }
            ];
            for (var j = 0; j < fields.length; j++) {
                var input = getCheckedRadio(fields[j].name);
                if (!input) continue;
                var line = formatBreakdownLine(fields[j].label, getCheckedLabelText(input), input.value);
                if (line) lines.push(line);
            }
            return lines;
        }

        function getNews2BreakdownLines() {
            var scale = document.getElementById('news2-scale').value;
            var o2Radio = getCheckedRadio('n2_o2');
            var o2 = o2Radio ? parseInt(o2Radio.value, 10) : 0;
            var items = [
                { label: 'Resp. frekvens', id: 'n2_resp', score: calcNEWS2Resp(getNum('n2_resp')) },
                { label: 'SpO2', id: 'n2_spo2', score: calcNEWS2SpO2(getNum('n2_spo2'), scale, o2) },
                { label: 'Systolisk BT', id: 'n2_bp', score: calcNEWS2BP(getNum('n2_bp')) },
                { label: 'Puls', id: 'n2_puls', score: calcNEWS2Pulse(getNum('n2_puls')) },
                { label: 'Temperatur', id: 'n2_temp', score: calcNEWS2Temp(getNum('n2_temp')) }
            ];
            var lines = [];
            for (var i = 0; i < items.length; i++) lines.push(formatBreakdownLine(items[i].label, getTextValueWithUnit(items[i].id), items[i].score));
            lines.push(formatBreakdownLine('Tilførsel av oksygen', getCheckedLabelText(o2Radio), o2Radio.value));
            var avpuRadio = getCheckedRadio('n2_avpu');
            lines.push(formatBreakdownLine('Bevissthet (ACVPU)', getCheckedLabelText(avpuRadio), avpuRadio.value));
            return lines;
        }
        function getQsofaBreakdownLines() {
            var lines = getChecklistBreakdownLines('qsofa-form');
            var panel = document.getElementById('qsofa-news2-panel');
            if (!panel || panel.classList.contains('hidden')) return lines;
            var scale = document.getElementById('qsn_scale').value;
            var o2Radio = getCheckedRadio('qsn_o2');
            var o2 = o2Radio ? parseInt(o2Radio.value, 10) : 0;
            var avpuRadio = getCheckedRadio('qsn_avpu');
            return lines.concat([
                formatBreakdownLine('NEWS2 resp. frekvens', getTextValueWithUnit('qsn_resp'), calcNEWS2Resp(getNum('qsn_resp'))),
                formatBreakdownLine('NEWS2 SpO2', getTextValueWithUnit('qsn_spo2'), calcNEWS2SpO2(getNum('qsn_spo2'), scale, o2)),
                formatBreakdownLine('NEWS2 systolisk BT', getTextValueWithUnit('qsn_bp'), calcNEWS2BP(getNum('qsn_bp'))),
                formatBreakdownLine('NEWS2 puls', getTextValueWithUnit('qsn_puls'), calcNEWS2Pulse(getNum('qsn_puls'))),
                formatBreakdownLine('NEWS2 temperatur', getTextValueWithUnit('qsn_temp'), calcNEWS2Temp(getNum('qsn_temp'))),
                formatBreakdownLine('NEWS2 oksygen', getCheckedLabelText(o2Radio), o2Radio.value),
                formatBreakdownLine('NEWS2 bevissthet', getCheckedLabelText(avpuRadio), avpuRadio.value)
            ]);
        }

        function getOnewsBreakdownLines() {
            var items = [
                { label: 'Resp. frekvens', id: 'o_resp', score: calcONEWSResp(getNum('o_resp')) },
                { label: 'SpO2', id: 'o_spo2', score: calcONEWSSpO2(getNum('o_spo2')) },
                { label: 'Systolisk BT', id: 'o_sbp', score: calcONEWSSBP(getNum('o_sbp')) },
                { label: 'Diastolisk BT', id: 'o_dbp', score: calcONEWSDBP(getNum('o_dbp')) },
                { label: 'Puls', id: 'o_puls', score: calcONEWSPulse(getNum('o_puls')) },
                { label: 'Temperatur', id: 'o_temp', score: calcONEWSTemp(getNum('o_temp')) }
            ];
            var lines = [];
            for (var i = 0; i < items.length; i++) lines.push(formatBreakdownLine(items[i].label, getTextValueWithUnit(items[i].id), items[i].score));
            return lines;
        }

        function getTewsBreakdownLines() {
            var ageVal = getNum('tews-age-val');
            var ageUnit = document.getElementById('tews-age-unit').value;
            var ageGroup = getTewsAgeGroup(ageVal, ageUnit);
            var rules = tewsRanges[ageGroup];
            var o2Radio = getCheckedRadio('tews_o2');
            var avpuRadio = getCheckedRadio('tews_avpu');
            var mobRadio = getCheckedRadio('tews_mobility');
            var injRadio = getCheckedRadio('tews_injury');
            var useTeenSBP = ageGroup === 5;
            var lines = [];
            lines.push('Aldersgruppe: ' + rules.name);
            lines.push(formatBreakdownLine('Resp. frekvens', getTextValueWithUnit('t_resp'), evalRule(getNum('t_resp'), rules.resp)));
            lines.push(formatBreakdownLine('Puls', getTextValueWithUnit('t_puls'), evalRule(getNum('t_puls'), rules.puls)));
            lines.push(formatBreakdownLine('SaO2 / SpO2', getTextValueWithUnit('t_spo2'), calcSpO2TEWS(getNum('t_spo2'), o2Radio && o2Radio.value === '1')));
            lines.push(formatBreakdownLine('Temperatur', getTextValueWithUnit('t_temp'), evalRule(getNum('t_temp'), rules.temp)));
            if (useTeenSBP) lines.push(formatBreakdownLine('Systolisk BT', getTextValueWithUnit('t_sbp'), calcTeenSBPTEWS(getNum('t_sbp'))));
            else lines.push(formatBreakdownLine('Kapillærfyllingstid', getTextValueWithUnit('t_kf'), calcKFTEWS(getNum('t_kf'))));
            lines.push(formatBreakdownLine('Skade', getCheckedLabelText(injRadio), injRadio.value));
            lines.push(formatBreakdownLine('Normal mobilitet', getCheckedLabelText(mobRadio), mobRadio.value));
            lines.push('Ekstra oksygentilførsel: ' + getCheckedLabelText(o2Radio) + ' (inngår i SaO2 / SpO2-poeng)');
            lines.push(formatBreakdownLine('Bevissthet (AVPU)', getCheckedLabelText(avpuRadio), avpuRadio.value));
            return lines;
        }

        function buildScoreBreakdownForCurrentTab() {
            var lines = [];
            if (currentTab === 'news2') lines = getNews2BreakdownLines();
            else if (currentTab === 'tews') lines = getTewsBreakdownLines();
            else if (currentTab === 'onews') lines = getOnewsBreakdownLines();
            else if (currentTab === 'ciwa') lines = getSelectBreakdownLines('#ciwa .ciwa-select');
            else if (currentTab === 'nihss') lines = getSelectBreakdownLines('#nihss .ciwa-select');
            else if (currentTab === 'gcs') lines = [
                getCheckedRadioBreakdown('gcs_e', 'Øyeåpning (E)'),
                getCheckedRadioBreakdown('gcs_v', 'Verbal respons (V)'),
                getCheckedRadioBreakdown('gcs_m', 'Motorisk respons (M)')
            ].filter(Boolean);
            else if (currentTab === 'abcd2') lines = getAbcdBreakdownLines();
            else if (currentTab === 'chads') lines = [
                getCheckedRadioBreakdown('chads_sex', 'Kjønn'),
                getCheckedRadioBreakdown('chads_age', 'Alder')
            ].filter(Boolean).concat(getChecklistBreakdownLines('chads-form'));
            else if (currentTab === 'qsofa') lines = getQsofaBreakdownLines();
            else if (currentTab === 'wells-dvt') lines = getChecklistBreakdownLines('wells-dvt-form');
            else if (currentTab === 'wells-le') lines = getChecklistBreakdownLines('wells-le-form');
            else if (currentTab === 'curb65') lines = getChecklistBreakdownLines('curb65-form');
            else if (currentTab === 'mantrel') lines = getChecklistBreakdownLines('mantrel-form');
            var score = document.getElementById('score-display').textContent.trim();
            var totalLine = currentTab === 'qsofa' && score.indexOf('/') !== -1 ? 'qSOFA/NEWS2 = ' + score : 'Totalt = ' + score + ' poeng';
            return ['Poengberegning'].concat(lines, [totalLine]).join('\n');
        }

        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function getPointTone(pointText) {
            var value = parseFloat(String(pointText).replace(',', '.'));
            if (isNaN(value)) return 'warn';
            if (value <= 0) return 'good';
            if (value === 1) return 'warn';
            return 'bad';
        }

        function getGcsPointTone(label, pointText) {
            var value = parseInt(pointText, 10);
            if (/Øyeåpning/.test(label)) {
                if (value === 4) return 'good';
                if (value === 3) return 'warn-good';
                if (value === 2) return 'warn';
                return 'bad';
            }
            if (/Verbal/.test(label)) {
                if (value === 5) return 'good';
                if (value === 4) return 'warn-good';
                if (value === 3) return 'warn';
                return 'bad';
            }
            if (/Motorisk/.test(label)) {
                if (value === 6) return 'good';
                if (value >= 4) return 'warn-good';
                if (value === 3) return 'warn';
                return 'bad';
            }
            return getPointTone(pointText);
        }

        function splitBreakdownLine(line) {
            var match = line.match(/^(.*?)(?:\s*=\s*)(-?\d+(?:[,.]\d+)?) poeng$/);
            if (!match) return { note: line };
            var left = match[1];
            var pointText = match[2] + ' p';
            var label = left;
            var value = '';
            var colonIndex = left.indexOf(': ');
            if (colonIndex !== -1) {
                label = left.substring(0, colonIndex);
                value = left.substring(colonIndex + 2);
            }
            var tone = currentTab === 'gcs' ? getGcsPointTone(label, match[2]) : getPointTone(match[2]);
            return { label: label, value: value, points: pointText, tone: tone };
        }

        function buildScoreBreakdownHtml(text) {
            var lines = text.split('\n');
            var title = lines.shift() || 'Poengberegning';
            var rows = [];
            for (var i = 0; i < lines.length; i++) {
                var row = splitBreakdownLine(lines[i]);
                if (row.note) {
                    rows.push('<tr class="score-breakdown-note"><td></td><td colspan="2">' + escapeHtml(row.note) + '</td></tr>');
                    continue;
                }
                var isTotal = /^Totalt$/i.test(row.label);
                var tone = row.tone;
                if (isTotal) {
                    var scoreCircle = document.getElementById('score-display');
                    if (scoreCircle && scoreCircle.classList.contains('score-0')) tone = 'good';
                    else if (scoreCircle && scoreCircle.classList.contains('score-low')) tone = 'warn';
                    else if (scoreCircle && scoreCircle.classList.contains('score-med')) tone = 'med';
                    else if (scoreCircle && scoreCircle.classList.contains('score-high')) tone = 'bad';
                }
                rows.push(
                    '<tr class="' + (isTotal ? 'score-breakdown-total' : '') + '">' +
                        '<td class="score-breakdown-dot-cell"><span class="score-breakdown-dot ' + tone + '"></span></td>' +
                        '<td><span class="score-breakdown-item">' + escapeHtml(row.label) + '</span>' +
                            (row.value ? '<span class="score-breakdown-value">' + escapeHtml(row.value) + '</span>' : '') +
                        '</td>' +
                        '<td class="score-breakdown-points">' + escapeHtml(row.points) + '</td>' +
                    '</tr>'
                );
            }
            return '<div class="score-breakdown-title">' + escapeHtml(title) + '</div>' +
                '<table class="score-breakdown-table"><tbody>' + rows.join('') + '</tbody></table>';
        }

        function updateScoreBreakdownTooltip() {
            var trigger = document.getElementById('score-breakdown-trigger');
            var tooltip = document.getElementById('score-breakdown-tooltip');
            if (!trigger || !tooltip) return;
            if (!currentScoreComplete) {
                tooltip.innerHTML = '';
                trigger.classList.remove('has-breakdown');
                trigger.removeAttribute('aria-label');
                return;
            }
            var text = buildScoreBreakdownForCurrentTab();
            tooltip.innerHTML = buildScoreBreakdownHtml(text);
            trigger.classList.add('has-breakdown');
            trigger.setAttribute('aria-label', text);
        }

        function collectCardSummary(section) {
            var lines = [];
            if (!section) return lines;

            var ageVal = document.getElementById('tews-age-val');
            var ageUnit = document.getElementById('tews-age-unit');
            if (section.id === 'tews' && ageVal && ageVal.value) {
                var ageText = ageVal.value + ' ' + (ageUnit && ageUnit.value === 'm' ? 'mnd' : 'år');
                lines.push('Barnets alder: ' + ageText);
            }

            var cards = section.querySelectorAll('.input-card');
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (!isElementVisible(card)) continue;
                var label = card.querySelector('.label');
                if (!label) continue;
                var title = label.textContent.replace(/\s+/g, ' ').trim();
                var value = '';

                var textInputs = card.querySelectorAll('input[type="text"]');
                if (textInputs.length > 1) {
                    var values = [];
                    for (var t = 0; t < textInputs.length; t++) {
                        if (textInputs[t].value) values.push(textInputs[t].value);
                    }
                    if (values.length === textInputs.length) {
                        value = card.id === 'abcd-bp-card' ? values.join('/') + ' mmHg' : values.join(' / ');
                    }
                } else if (textInputs.length === 1 && textInputs[0].value) {
                    var unit = card.querySelector('.input-unit');
                    value = textInputs[0].value + (unit ? ' ' + unit.textContent.trim() : '');
                } else {
                    var select = card.querySelector('select');
                    if (select && select.value) {
                        value = select.options[select.selectedIndex].text.trim();
                    } else {
                        var checkedInputs = card.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
                        if (checkedInputs.length) {
                            var parts = [];
                            for (var j = 0; j < checkedInputs.length; j++) {
                                parts.push(getCheckedLabelText(checkedInputs[j]));
                            }
                            value = parts.join(', ');
                        }
                    }
                }

                if (value) lines.push(title + ': ' + value);
            }
            return lines;
        }

        function collectChecklistSummary(section) {
            var lines = [];
            if (!section) return lines;
            var rows = section.querySelectorAll('.wells-row');
            for (var i = 0; i < rows.length; i++) {
                var yesInput = rows[i].querySelector('input.wells-ja:checked');
                if (!yesInput) continue;
                var text = rows[i].querySelector('.wells-text');
                if (text) lines.push(text.textContent.replace(/\s+/g, ' ').trim());
            }
            return lines;
        }

        function buildCopyTextForCurrentTab() {
            var section = document.getElementById(currentTab);
            var title = getCurrentTabTitle();
            var score = document.getElementById('score-display').textContent.trim();
            var interpretation = document.getElementById('score-interpretation').textContent.trim();
            var lines = ['[' + title + '] - ' + formatCopyDate(), 'Score: ' + score + ' - ' + interpretation];
            var details = collectCardSummary(section);
            var checklist = collectChecklistSummary(section);
            if (details.length) {
                lines.push('', 'Utfylte verdier:');
                lines = lines.concat(details.map(function(item) { return '- ' + item; }));
            }
            if (checklist.length) {
                lines.push('', 'Positive funn:');
                lines = lines.concat(checklist.map(function(item) { return '- ' + item; }));
            }
            if (currentTab === 'abcd2') {
                var scoreLines = getAbcdBreakdownLines();
                if (scoreLines.length) {
                    lines.push('', 'Poengberegning:');
                    lines = lines.concat(scoreLines.map(function(item) { return '- ' + item; }));
                    lines.push('- Totalt = ' + score + ' poeng');
                }
            }
            return lines.join('\n');
        }

        function showConfirmDialog(config) {
            config = config || {};
            var modal = document.getElementById('confirm-modal');
            if (!modal) return;
            var title = modal.querySelector('.modal-title');
            var body = document.getElementById('modal-body');
            var noBtn = document.getElementById('modal-btn-no');
            var yesBtn = document.getElementById('modal-btn-yes');
            if (title) title.textContent = config.title || 'Bekreft';
            if (body) body.innerText = config.body || '';
            if (noBtn) noBtn.textContent = config.cancelText || 'Avbryt';
            if (yesBtn) yesBtn.textContent = config.confirmText || 'Bekreft';
            modal.classList.add('show');
            if (yesBtn) {
                yesBtn.onclick = function() {
                    modal.classList.remove('show');
                    if (typeof config.onConfirm === 'function') config.onConfirm();
                };
            }
            if (noBtn) {
                noBtn.onclick = function() {
                    modal.classList.remove('show');
                    if (typeof config.onCancel === 'function') config.onCancel();
                };
            }
        }

        function isAdvancedNEWS2Started() {
            var names = ['adv_q1', 'adv_q2', 'adv_q3', 'adv_q4', 'adv_q5'];
            for (var i = 0; i < names.length; i++) {
                if (document.querySelector('input[name="' + names[i] + '"]:checked')) return true;
            }
            return false;
        }

        function hasStartedCurrentRegistration() {
            if (currentRegistrationCopied) return false;
            var advancedPage = document.getElementById('advanced-news2-page');
            if (advancedPage && !advancedPage.classList.contains('hidden')) return isAdvancedNEWS2Started() || isNEWS2CompleteForAdvanced();
            var section = currentTab ? document.getElementById(currentTab) : null;
            if (!section) return false;
            var textInputs = section.querySelectorAll('input[type="text"]');
            for (var i = 0; i < textInputs.length; i++) {
                if (textInputs[i].value !== '') return true;
            }
            var checkedChoices = section.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
            for (var c = 0; c < checkedChoices.length; c++) {
                var choiceName = checkedChoices[c].name || '';
                if (choiceName === 'news2_scale_choice' || choiceName === 'qsn_scale_choice') continue;
                return true;
            }
            var selects = section.querySelectorAll('select');
            for (var j = 0; j < selects.length; j++) {
                if (selects[j].disabled || selects[j].value === '') continue;
                if (selects[j].id === 'news2-scale' && selects[j].value === '1') continue;
                if (selects[j].id === 'tews-age-unit' && selects[j].value === 'y') continue;
                return true;
            }
            return false;
        }

        function requestShowWelcomeMenu() {
            if (!hasStartedCurrentRegistration()) {
                showWelcomeMenu();
                return;
            }
            showConfirmDialog({
                title: 'Avslutte registrering?',
                body: 'Gjeldende registrering vil bli avsluttet og skjemaet nullstilles. Vil du gå tilbake til hovedmenyen?',
                cancelText: 'Fortsett registrering',
                confirmText: 'Gå til hovedmeny',
                onConfirm: function() {
                    resetForm(true);
                    showWelcomeMenu();
                }
            });
        }

        function handleScaleChange() {
            var select = document.getElementById('news2-scale');
            if (select.value === '2') {
                var warningText = "Skala 2 skal kun brukes på pasienter med kjent hyperkapnisk respirasjonssvikt med mål om SpO2 mellom 88-92 %, verifisert ved blodgassanalyse.\n\nLege skal dokumentere i journal når Skala 2 skal brukes. Ved alle andre tilfeller skal Skala 1 benyttes.\n\nEr du sikker på at du vil bruke Skala 2?";
                showConfirmDialog({
                    title: 'Bekreft endring av skala',
                    body: warningText,
                    cancelText: 'Nei, bruk Skala 1',
                    confirmText: 'Ja, bruk Skala 2',
                    onConfirm: function() {
                        calculateScore();
                    },
                    onCancel: function() {
                        setScaleChoice('news2-scale', 'news2_scale_1', '1');
                        calculateScore();
                    }
                });
            } else {
                calculateScore();
            }
        }

        function showWelcomeMenu() {
            updateHeaderByCategory(null);
            currentCategory = null;
            closeSettingsPanel();
            var adv = document.getElementById('advanced-news2-page');
            if (adv) adv.classList.add('hidden');
            document.getElementById('welcome-menu').classList.remove('hidden');
            document.getElementById('sources-link').classList.remove('hidden');
            document.getElementById('header-back-btn').classList.add('hidden');
            document.getElementById('main-nav').classList.add('hidden');
            document.querySelector('.content-wrap').classList.add('hidden');
            document.querySelector('.score-footer').classList.add('hidden');
        }

        function copyAdvancedNEWS2Result() {
            var now = new Date();
            function pad(n) { return (n < 10 ? '0' : '') + n; }
            var dt = pad(now.getDate()) + "." + pad(now.getMonth() + 1) + "." + now.getFullYear() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
            var text = buildCopyTextForCurrentTab() + "\n\n";
            text += "[Avansert hastegradvurdering] - " + dt + "\n";
            text += "Supplerende vurdering gjennomført for grønn NEWS2.\n\n";
            text += "Svar:\n";
            text += "- Faste medisiner: " + getAdvancedAnswerText('adv_q1') + "\n";
            text += "- Nylig kontakt med helsetjenesten om dette: " + getAdvancedAnswerText('adv_q2') + "\n";
            text += "- Har eksisterende tilstand: " + getAdvancedAnswerText('adv_q3') + "\n";
            text += "- Tilhører annen risikogruppe: " + getAdvancedAnswerText('adv_q4') + "\n";
            text += "- Pasienten ber om legetime/er usikker: " + getAdvancedAnswerText('adv_q5') + "\n\n";
            if (advancedNEWS2InfoGiven) {
                text += "Tiltak: Infoskriv på " + getAdvancedLangName(advancedNEWS2InfoLang) + " gis ut. Pasienten drar hjem.";
            } else {
                text += "Tiltak: Pasienten drar hjem.";
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function(){ finishAdvancedNEWS2Copy(); });
            } else {
                fallbackCopyTextToClipboard(text);
                finishAdvancedNEWS2Copy();
            }
        }

        function copyToClipboard() {
            if (!currentScoreComplete) return;
            var textToCopy = buildCopyTextForCurrentTab();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    currentRegistrationCopied = true;
                    showToast('Kopiert til utklippstavlen!');
                }).catch(function() {
                    fallbackCopyTextToClipboard(textToCopy);
                });
            } else {
                fallbackCopyTextToClipboard(textToCopy);
            }
        }

        function setToolPatientSheetLanguage(lang) {
            currentPatientSheet = lang || 'no';
            var select = document.getElementById('tool-patient-sheet-lang');
            if (select && select.value !== currentPatientSheet) select.value = currentPatientSheet;
        }

        function printPatientSheetFromTools() {
            var select = document.getElementById('tool-patient-sheet-lang');
            setToolPatientSheetLanguage(select ? select.value : 'no');
            printPatientSheet();
        }

