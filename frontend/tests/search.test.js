const { Builder, By, until } = require('selenium-webdriver');

describe('Dashboard Search & Filter Flow', () => {
  let driver;
  const searchTaskName = `FindMe_Task_${Date.now()}`;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  afterAll(async () => { if (driver) await driver.quit(); });

  it('1. Should create an account and login', async () => {
    await driver.get('http://localhost:5173/register'); 
    await driver.findElement(By.css('[data-testid="register-username-input"]')).sendKeys("teste-s");
    await driver.findElement(By.css('[data-testid="register-email-input"]')).sendKeys("teste-s@teste.com");
    await driver.findElement(By.css('[data-testid="register-password-input"]')).sendKeys("s3nh@Forte");
    await driver.findElement(By.css('[data-testid="register-submit-button"]')).click();

    await driver.wait(until.urlContains('/login'), 5000);

    const userInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-username-input"]')), 5000);
    await userInput.sendKeys("teste-s");
    await driver.findElement(By.css('[data-testid="login-password-input"]')).sendKeys("s3nh@Forte");
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 10000);
  });

  it('2. Should create an category and create a target task with category', async () => {
    await driver.findElement(By.css('[data-testid="dashboard-manage-category-button"]')).click();
    
    const catInput = await driver.wait(until.elementLocated(By.css('[data-testid="category-modal-name-input"]')), 5000);
    await driver.wait(until.elementIsVisible(catInput), 5000);
    
    await driver.sleep(500);
    await catInput.sendKeys("teste");
    
    await driver.findElement(By.css('[data-testid="category-modal-add-button"]')).click();

    await driver.wait(until.elementLocated(By.css(`[data-testid="category-modal-name-teste"]`)), 5000);

    await driver.findElement(By.css('[data-testid="category-modal-close-button"]')).click();

    await driver.findElement(By.css('[data-testid="dashboard-add-task-button"]')).click();
    const titleInput = await driver.wait(until.elementLocated(By.css('[data-testid="task-title-input"]')), 5000);
    await driver.wait(until.elementIsVisible(titleInput), 5000);
    await driver.sleep(500);
    await titleInput.sendKeys(searchTaskName);

    const modalCategorySelect = await driver.findElement(By.css('[data-testid="task-category-select"]'));
    await modalCategorySelect.click();
    const modalOptions = await modalCategorySelect.findElements(By.css('option'));
    if (modalOptions.length > 1) {
       await modalOptions[1].click(); 
    }

    await driver.findElement(By.css('[data-testid="save-task-button"]')).click();
    await driver.sleep(1000);
  });

  it('3. Should SEARCH for the task by text', async () => {
    const searchInput = await driver.findElement(By.css('[data-testid="dashboard-search-input"]'));
    await searchInput.sendKeys('FindMe_Task');

    const searchBtn = await driver.findElement(By.css('[data-testid="dashboard-search-button"]'));
    await searchBtn.click();
    
    await driver.sleep(1000);

    const taskFound = await driver.findElement(By.css(`[data-testid="task-title-${searchTaskName}"]`));
    expect(await taskFound.isDisplayed()).toBe(true);
  });

  it('4. Should FILTER tasks by category', async () => {
    const filterSelect = await driver.findElement(By.css('[data-testid="dashboard-search-category-button"]'));
    await filterSelect.click();
    
    const filterOptions = await filterSelect.findElements(By.css('option'));
    if (filterOptions.length > 1) {
       await filterOptions[1].click(); 
    }

    await driver.sleep(1000); 

    const taskFound = await driver.findElement(By.css(`[data-testid="task-title-${searchTaskName}"]`));
    expect(await taskFound.isDisplayed()).toBe(true);
  });

  it('5. Should CLEAR search/filters and clean up', async () => {
    const searchInput = await driver.findElement(By.css('[data-testid="dashboard-search-input"]'));
    await searchInput.clear();
    await driver.findElement(By.css('[data-testid="dashboard-search-button"]')).click();

    const filterSelect = await driver.findElement(By.css('[data-testid="dashboard-search-category-button"]'));
    await filterSelect.click();
    const filterOptions = await filterSelect.findElements(By.css('option'));
    await filterOptions[0].click();

    await driver.sleep(1000);

    const taskRow = await driver.findElement(By.css(`[data-testid="task-row-${searchTaskName}"]`));
    await taskRow.findElement(By.css(`[data-testid="delete-task-button-${searchTaskName}"]`)).click();
    const confirmBtn = await driver.wait(until.elementLocated(By.css('[data-testid="delete-modal-confirm-button"]')), 5000);
    await confirmBtn.click();
  });

  it('5. Should DELETE the category and account to clean up', async () => {
    await driver.findElement(By.css('[data-testid="dashboard-manage-category-button"]')).click();

    await driver.findElement(By.css(`[data-testid="category-modal-delete-button-teste"]`)).click();
    
    await driver.sleep(2000);

    await driver.findElement(By.css('[data-testid="category-modal-close-button"]')).click();

    await driver.get('http://localhost:5173/profile'); 
    const deleteBtn = await driver.wait(
      until.elementLocated(By.css('[data-testid="profile-delete-account-button"]')), 
      5000
    );
    
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
    await driver.sleep(500); 
    
    await deleteBtn.click();

    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept(); 

    await driver.wait(until.urlContains('/login'), 10000);
  });
});