// Главный модуль приложения
const PortfolioApp = {
    // Инициализация приложения
    init() {
        console.log('Portfolio App инициализирован');
        
        // Загрузка проектов из localStorage или начальных данных
        this.loadProjects();
        
        // Инициализация компонентов
        this.initComponents();
        
        // Инициализация событий
        this.initEvents();
        
        // Анимация при загрузке
        this.pageLoadAnimation();
    },
    
    // Загрузка проектов из localStorage
    loadProjects() {
        // Пробуем загрузить из localStorage
        const savedProjects = localStorage.getItem('portfolioProjects');
        
        if (savedProjects) {
            // Используем сохраненные проекты
            this.projects = JSON.parse(savedProjects);
            console.log('Проекты загружены из localStorage', this.projects.length);
        } else {
            // Используем начальные проекты
            this.projects = [
                {
                    id: 1,
                    title: 'Мой первый Figma проект',
                    description: 'UI/UX дизайн мобильного приложения для управления задачами.',
                    category: 'figma',
                    tags: ['Figma', 'UI/UX', 'Мобильный дизайн', 'Прототип'],
                    figmaLink: 'https://www.figma.com/file/example',
                    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }
            ];
            // Сохраняем начальные проекты в localStorage
            this.saveProjects();
            console.log('Использованы начальные проекты');
        }
    },
    
    // Сохранение проектов в localStorage
    saveProjects() {
        localStorage.setItem('portfolioProjects', JSON.stringify(this.projects));
        console.log('Проекты сохранены в localStorage');
    },
    
    // Инициализация компонентов
    initComponents() {
        // 1. Тема приложения
        this.themeToggle = document.getElementById('themeToggle');
        this.glitchToggle = document.getElementById('glitchToggle');
        this.glitchBg = document.getElementById('glitchBg');
        
        // 2. Навигация
        this.menuToggle = document.getElementById('menuToggle');
        this.menuClose = document.getElementById('menuClose');
        this.mobileMenu = document.getElementById('mobileMenu');
        
        // 3. Проекты
        this.projectsGrid = document.getElementById('projectsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // 4. Форма
        this.contactForm = document.getElementById('contactForm');
        
        // 5. Кнопка скачивания CV
        this.downloadCV = document.getElementById('downloadCV');
        
        // 6. Статистика
        this.statNumbers = document.querySelectorAll('.stat-number');
        
        // 7. Навыки
        this.skillBars = document.querySelectorAll('.skill-bar');
        
        // Загрузка проектов
        this.renderProjects();
    },
    
    // Инициализация событий
    initEvents() {
        // Переключение темы
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Переключение глитч-эффектов
        this.glitchToggle.addEventListener('click', () => this.toggleGlitch());
        
        // Мобильное меню
        this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        this.menuClose.addEventListener('click', () => this.toggleMobileMenu());
        
        // Фильтрация проектов
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProjects(e));
        });
        
        // Форма обратной связи
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Скачивание CV
        this.downloadCV.addEventListener('click', () => this.downloadCVFile());
        
        // Анимация чисел при скролле
        window.addEventListener('scroll', () => this.animateOnScroll());
        
        // Плавная прокрутка для ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Инициализация анимации
        this.animateNumbers();
        this.animateSkills();
    },
    
    // Рендер проектов
    renderProjects(filter = 'all') {
        this.projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.category === filter);
        
        if (filteredProjects.length === 0) {
            this.projectsGrid.innerHTML = `
                <div class="no-projects" style="text-align: center; padding: 50px; color: var(--text-color);">
                    <h3>Нет проектов</h3>
                    <p style="margin-top: 10px;">Нажмите кнопку "Добавить проект" внизу справа</p>
                </div>
            `;
            return;
        }
        
        filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });
        
        // Анимация появления проектов
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }, 100);
    },
    
    // Создание карточки проекта
    createProjectCard(project) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        projectCard.dataset.category = project.category;
        projectCard.dataset.id = project.id;
        
        // Определяем иконку в зависимости от категории
        let categoryIcon = 'fab fa-figma';
        let categoryName = 'Figma';
        
        switch(project.category) {
            case 'figma':
                categoryIcon = 'fab fa-figma';
                categoryName = 'Figma';
                break;
            case 'photo':
                categoryIcon = 'fas fa-camera';
                categoryName = 'Фото';
                break;
            case 'sites':
                categoryIcon = 'fas fa-globe';
                categoryName = 'Сайт';
                break;
        }
        
        projectCard.innerHTML = `
            <div class="project-image" style="background: linear-gradient(45deg, #000, #333);">
                ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;">` : ''}
                <div class="image-glitch-layer"></div>
                <div class="project-category-badge">
                    <i class="${categoryIcon}"></i>
                    <span>${categoryName}</span>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-actions">
                    ${project.figmaLink ? 
                        `<a href="${project.figmaLink}" target="_blank" class="project-link">
                            <i class="fab fa-figma"></i> Открыть в Figma
                        </a>` : 
                        ''
                    }
                    <button class="project-link delete-project" data-id="${project.id}">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        `;
        
        // Добавляем обработчики удаления
        const deleteBtn = projectCard.querySelector('.delete-project');
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteProject(project.id);
            });
        }
        
        return projectCard;
    },
    
    // Редактирование проекта (с помощью prompt)
    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        // Создаем форму редактирования через prompt
        const newTitle = prompt('Новое название проекта:', project.title);
        if (newTitle === null) return; // Пользователь нажал "Отмена"
        
        const newDescription = prompt('Новое описание проекта:', project.description);
        if (newDescription === null) return;
        
        const newTags = prompt('Новые теги (через запятую):', project.tags.join(', '));
        if (newTags === null) return;
        
        const newFigmaLink = prompt('Новая ссылка на Figma:', project.figmaLink || '');
        if (newFigmaLink === null) return;
        
        const newImage = prompt('Новая ссылка на изображение:', project.image || '');
        if (newImage === null) return;
        
        const newCategory = prompt('Новая категория (figma/photo/sites):', project.category);
        if (newCategory === null) return;
        
        // Обновляем проект
        project.title = newTitle.trim();
        project.description = newDescription.trim();
        project.tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        project.figmaLink = newFigmaLink.trim() || null;
        project.image = newImage.trim() || project.image;
        project.category = newCategory.trim();
        
        // Сохраняем в localStorage
        this.saveProjects();
        
        // Обновляем отображение
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        this.renderProjects(activeFilter);
        
        this.showNotification(`Проект "${project.title}" обновлен!`);
    },
    
    // Удаление проекта
    deleteProject(projectId) {
        if (confirm('Вы уверены, что хотите удалить этот проект?')) {
            this.projects = this.projects.filter(project => project.id !== projectId);
            
            // Сохраняем в localStorage
            this.saveProjects();
            
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            this.renderProjects(activeFilter);
            
            this.showNotification('Проект удален');
        }
    },
    
    // Добавление нового проекта (через prompt)
    addNewProject() {
        const title = prompt('Название проекта:');
        if (!title || title.trim() === '') {
            this.showNotification('Название проекта обязательно!', 'error');
            return;
        }
        
        const description = prompt('Описание проекта:');
        if (!description || description.trim() === '') {
            this.showNotification('Описание проекта обязательно!', 'error');
            return;
        }
        
        const category = prompt('Категория (figma/photo/sites):');
        if (!category || !['figma', 'photo', 'sites'].includes(category.trim().toLowerCase())) {
            this.showNotification('Категория должна быть: figma, photo или sites', 'error');
            return;
        }
        
        const tags = prompt('Теги (через запятую):') || '';
        const figmaLink = prompt('Ссылка на Figma (если есть):') || '';
        const image = prompt('Ссылка на изображение (если есть):') || '';
        
        const newProject = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            category: category.trim().toLowerCase(),
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
            figmaLink: figmaLink.trim() || null,
            image: image.trim() || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        };
        
        this.projects.push(newProject);
        this.saveProjects();
        
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        this.renderProjects(activeFilter);
        
        this.showNotification(`Проект "${newProject.title}" добавлен!`);
        
        // Прокручиваем к новому проекту
        setTimeout(() => {
            const newProjectElement = document.querySelector(`[data-id="${newProject.id}"]`);
            if (newProjectElement) {
                newProjectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    },
    
    // Остальные методы...
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const icon = this.themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            this.showNotification('Тёмная тема включена');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            this.showNotification('Светлая тема включена');
        }
    },
    
    toggleGlitch() {
        const isActive = this.glitchBg.classList.toggle('active');
        const icon = this.glitchToggle.querySelector('i');
        
        if (isActive) {
            document.body.classList.add('glitch-active');
            icon.classList.remove('fa-bolt');
            icon.classList.add('fa-bolt-lightning');
            this.showNotification('Глитч-эффекты включены');
        } else {
            document.body.classList.remove('glitch-active');
            icon.classList.remove('fa-bolt-lightning');
            icon.classList.add('fa-bolt');
            this.showNotification('Глитч-эффекты выключены');
        }
    },
    
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') 
            ? 'hidden' 
            : '';
    },
    
    filterProjects(event) {
        const filter = event.target.dataset.filter;
        
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        this.projectsGrid.style.opacity = '0.7';
        
        setTimeout(() => {
            this.renderProjects(filter);
            setTimeout(() => {
                this.projectsGrid.style.opacity = '1';
            }, 300);
        }, 200);
    },
    
    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.showNotification(`Сообщение отправлено! Спасибо, ${data.name}`);
            this.contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    },
    
    downloadCVFile() {
        this.showNotification('Скачивание CV...');
        this.downloadCV.style.opacity = '0.8';
        
        setTimeout(() => {
            const text = `Левон Меликян\nFrontend разработчик\n\nОпыт: 2+ года\nПроекты: ${this.projects.length}\nEmail: pochta@levon.com\n\nНавыки:\n- HTML/CSS: 80%\n- JavaScript: 65%\n- React: 50%\n- Figma, Git, VS Code\n\nОбразование: СПБГУПТД ИИТА`;
            
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Меликян_Левон_CV.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification('CV успешно скачан!');
            this.downloadCV.style.opacity = '1';
        }, 1000);
    },
    
    animateNumbers() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        });
    },
    
    animateSkills() {
        this.skillBars.forEach(skill => {
            const level = skill.dataset.level;
            const bar = skill.querySelector('.level-bar');
            const percent = skill.querySelector('.level-percent');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            bar.style.width = `${level}%`;
                            percent.textContent = `${level}%`;
                            percent.style.right = '10px';
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(skill);
        });
    },
    
    smoothScroll(event) {
        event.preventDefault();
        
        const targetId = event.currentTarget.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            if (this.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        }
    },
    
    animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('fade-in');
            }
        });
    },
    
    pageLoadAnimation() {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('fade-in');
            }, index * 200);
        });
    },
    
    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    }
};

// Глобальная функция для добавления проекта (доступна из консоли)
window.addProject = function() {
    PortfolioApp.addNewProject();
};

// Глобальная функция для редактирования проекта (по ID)
window.editProject = function(projectId) {
    PortfolioApp.editProject(projectId);
};

// Глобальная функция для удаления проекта (по ID)
window.deleteProject = function(projectId) {
    PortfolioApp.deleteProject(projectId);
};

// Глобальная функция для очистки всех проектов
window.clearAllProjects = function() {
    if (confirm('Вы уверены, что хотите удалить ВСЕ проекты?')) {
        PortfolioApp.projects = [];
        PortfolioApp.saveProjects();
        PortfolioApp.renderProjects();
        PortfolioApp.showNotification('Все проекты удалены');
    }
};

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем кнопку для добавления проектов
    const addProjectBtn = document.createElement('button');
    addProjectBtn.id = 'globalAddProjectBtn';
    addProjectBtn.className = 'btn btn-primary';
    addProjectBtn.innerHTML = '<i class="fas fa-plus"></i> Добавить проект';
    addProjectBtn.style.position = 'fixed';
    addProjectBtn.style.bottom = '20px';
    addProjectBtn.style.right = '20px';
    addProjectBtn.style.zIndex = '9999';
    addProjectBtn.style.padding = '12px 20px';
    addProjectBtn.style.fontSize = '0.9rem';
    
    // Добавляем обработчик события
    addProjectBtn.addEventListener('click', () => {
        PortfolioApp.addNewProject();
    });
    
    document.body.appendChild(addProjectBtn);
    
    // Инициализируем приложение
    PortfolioApp.init();
    
    // Добавляем кнопку для редактирования (двойной клик по проекту)
    document.addEventListener('dblclick', (e) => {
        const projectCard = e.target.closest('.project-card');
        if (projectCard) {
            const projectId = parseInt(projectCard.dataset.id);
            PortfolioApp.editProject(projectId);
        }
    });
    
    console.log('Глобальные функции доступны:');
    console.log('- addProject() - добавить новый проект');
    console.log('- editProject(id) - редактировать проект по ID');
    console.log('- deleteProject(id) - удалить проект по ID');
    console.log('- clearAllProjects() - удалить все проекты');
});

// Ресайз окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && PortfolioApp.mobileMenu && PortfolioApp.mobileMenu.classList.contains('active')) {
        PortfolioApp.toggleMobileMenu();
    }
});