   // Simple variables to store our data
        let colors = [];
        let locked = [false, false, false, false, false];
        let currentTheme = 'light';

        // Get elements
        const container = document.getElementById('paletteContainer');
        const generateBtn = document.getElementById('generateBtn');
        const exportBtn = document.getElementById('exportBtn');
        const typeSelect = document.getElementById('paletteType');
        const notification = document.getElementById('notification');
        const themeToggle = document.getElementById('themeToggle');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        // Theme toggle function
        function toggleTheme() {
            if (currentTheme === 'light') {
                currentTheme = 'dark';
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                currentTheme = 'light';
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        }

        // Generate random color
        function getRandomColor() {
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Convert HSL to HEX
        function hslToHex(h, s, l) {
            s = s / 100;
            l = l / 100;
            let c = (1 - Math.abs(2 * l - 1)) * s;
            let x = c * (1 - Math.abs((h / 60) % 2 - 1));
            let m = l - c / 2;
            let r = 0, g = 0, b = 0;

            if (h >= 0 && h < 60) {
                r = c; g = x; b = 0;
            } else if (h >= 60 && h < 120) {
                r = x; g = c; b = 0;
            } else if (h >= 120 && h < 180) {
                r = 0; g = c; b = x;
            } else if (h >= 180 && h < 240) {
                r = 0; g = x; b = c;
            } else if (h >= 240 && h < 300) {
                r = x; g = 0; b = c;
            } else if (h >= 300 && h < 360) {
                r = c; g = 0; b = x;
            }

            let red = Math.round((r + m) * 255).toString(16).padStart(2, '0');
            let green = Math.round((g + m) * 255).toString(16).padStart(2, '0');
            let blue = Math.round((b + m) * 255).toString(16).padStart(2, '0');

            return '#' + red + green + blue;
        }

        // Generate palette based on type
        function generateColors(type) {
            let newColors = [];
            
            if (type === 'random') {
                for (let i = 0; i < 5; i++) {
                    newColors.push(getRandomColor());
                }
            }
            else if (type === 'monochromatic') {
                let hue = Math.random() * 360;
                for (let i = 0; i < 5; i++) {
                    let lightness = 20 + (i * 15);
                    newColors.push(hslToHex(hue, 70, lightness));
                }
            }
            else if (type === 'analogous') {
                let hue = Math.random() * 360;
                for (let i = 0; i < 5; i++) {
                    let newHue = (hue + (i * 30)) % 360;
                    newColors.push(hslToHex(newHue, 70, 50));
                }
            }
            else if (type === 'complementary') {
                let hue = Math.random() * 360;
                let opposite = (hue + 180) % 360;
                newColors.push(hslToHex(hue, 70, 40));
                newColors.push(hslToHex(hue, 70, 60));
                newColors.push(hslToHex((hue + opposite) / 2, 50, 50));
                newColors.push(hslToHex(opposite, 70, 40));
                newColors.push(hslToHex(opposite, 70, 60));
            }
            else if (type === 'triadic') {
                let hue = Math.random() * 360;
                newColors.push(hslToHex(hue, 70, 50));
                newColors.push(hslToHex((hue + 120) % 360, 70, 50));
                newColors.push(hslToHex((hue + 240) % 360, 70, 50));
                newColors.push(hslToHex(hue, 50, 70));
                newColors.push(hslToHex((hue + 120) % 360, 50, 30));
            }
            
            // Keep locked colors
            for (let i = 0; i < 5; i++) {
                if (!locked[i]) {
                    colors[i] = newColors[i];
                }
            }
            
            showColors();
        }

        // Check if color is light or dark
        function isLightColor(hex) {
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            let brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128;
        }

        // Display colors on page
        function showColors() {
            container.innerHTML = '';
            
            for (let i = 0; i < 5; i++) {
                let color = colors[i];
                let textColor = isLightColor(color) ? '#1e293b' : '#ffffff';
                
                let card = document.createElement('div');
                card.className = 'color-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer';
                
                card.innerHTML = `
                    <div class="h-48 relative group" style="background-color: ${color}">
                        <button class="lock-btn absolute top-3 right-3 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100" onclick="toggleLock(${i}); event.stopPropagation();">
                            <svg class="lock-icon w-5 h-5" style="color: ${textColor}" fill="${locked[i] ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                ${locked[i] ? 
                                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>' :
                                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>'
                                }
                            </svg>
                        </button>
                    </div>
                    <div class="p-4" onclick="copyColor('${color}')">
                        <p class="text-2xl font-bold text-slate-800 mb-1">${color.toUpperCase()}</p>
                        <p class="text-sm text-slate-500">Click to copy</p>
                    </div>
                `;
                
                container.appendChild(card);
            }
        }

        // Toggle lock on color
        function toggleLock(index) {
            locked[index] = !locked[index];
            showColors();
        }

        // Copy color to clipboard
        function copyColor(color) {
            // Create temporary input
            let tempInput = document.createElement('input');
            tempInput.value = color;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show notification
            notification.classList.remove('hidden');
            setTimeout(function() {
                notification.classList.add('hidden');
            }, 2000);
        }

        // Export palette
        function exportColors() {
            let text = '/* Color Palette */\n\n';
            text += ':root {\n';
            for (let i = 0; i < colors.length; i++) {
                text += '  --color-' + (i + 1) + ': ' + colors[i] + ';\n';
            }
            text += '}\n\n';
            text += '/* Colors Array */\n';
            text += '/* ' + JSON.stringify(colors, null, 2) + ' */';
            
            // Download file
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'color-palette.css');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        // Button clicks
        generateBtn.onclick = function() {
            generateColors(typeSelect.value);
        };

        exportBtn.onclick = function() {
            exportColors();
        };

        typeSelect.onchange = function() {
            generateColors(typeSelect.value);
        };

        themeToggle.onclick = function() {
            toggleTheme();
        };

        // Spacebar to generate
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && e.target.tagName !== 'SELECT') {
                e.preventDefault();
                generateColors(typeSelect.value);
            }
        });

        // Start with random colors
        generateColors('random');