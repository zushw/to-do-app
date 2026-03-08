const { Builder, By, until } = require('selenium-webdriver');

describe('Full Task Flow with Description and Category', () => {
  let driver;
  const uniqueTaskName = `Full Task ${Date.now()}`;
  const editedTaskName = `${uniqueTaskName} Edited`;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  afterAll(async () => { if (driver) await driver.quit(); });

  it('1. Should create an account and login', async () => {
    await driver.get('http://localhost:5173/register'); 
    await driver.findElement(By.css('[data-testid="register-username-input"]')).sendKeys("teste-t");
    await driver.findElement(By.css('[data-testid="register-email-input"]')).sendKeys("teste-t@teste.com");
    await driver.findElement(By.css('[data-testid="register-password-input"]')).sendKeys("s3nh@Forte");
    await driver.findElement(By.css('[data-testid="register-submit-button"]')).click();

    await driver.wait(until.urlContains('/login'), 5000);

    const userInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-username-input"]')), 5000);
    await userInput.sendKeys("teste-t");
    await driver.findElement(By.css('[data-testid="login-password-input"]')).sendKeys("s3nh@Forte");
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 10000);
  });

  it('2. Should CREATE a category and full task', async () => {
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
    await titleInput.sendKeys(uniqueTaskName);

    await driver.findElement(By.css('[data-testid="task-description-input"]')).sendKeys('Esta é uma descrição gerada pelo robô do Selenium.');

    const categorySelect = await driver.findElement(By.css('[data-testid="task-category-select"]'));
    await categorySelect.click();
    const options = await categorySelect.findElements(By.css('option'));
    if (options.length > 1) {
       await options[1].click();
    }

    await driver.findElement(By.css('[data-testid="save-task-button"]')).click();
    await driver.sleep(1000); 

    await driver.wait(until.elementLocated(By.css(`[data-testid="task-title-${uniqueTaskName}"]`)), 5000);
  });

  it('3. Should EDIT all fields of the task', async () => {
    const taskRow = await driver.findElement(By.css(`[data-testid="task-row-${uniqueTaskName}"]`));
    await taskRow.findElement(By.css(`[data-testid="edit-task-button-${uniqueTaskName}"]`)).click();

    const titleInput = await driver.wait(until.elementLocated(By.css('[data-testid="task-title-input"]')), 5000);
    await driver.wait(until.elementIsVisible(titleInput), 5000);
    await titleInput.clear();
    await titleInput.sendKeys(editedTaskName);

    const descInput = await driver.findElement(By.css('[data-testid="task-description-input"]'));
    await descInput.clear();
    await descInput.sendKeys('Descrição editada com sucesso!');

    const categorySelect = await driver.findElement(By.css('[data-testid="task-category-select"]'));
    await categorySelect.click();
    const options = await categorySelect.findElements(By.css('option'));
    await options[0].click(); 

    await driver.findElement(By.css('[data-testid="save-task-button"]')).click();
    await driver.sleep(1000); 
    
    await driver.wait(until.elementLocated(By.css(`[data-testid="task-title-${editedTaskName}"]`)), 5000);
  });

  it('4. Should COMPLETE and UNCOMPLETE the task', async () => {
    let taskRow = await driver.findElement(By.css(`[data-testid="task-row-${editedTaskName}"]`));
    
    let checkbox = await taskRow.findElement(By.css(`[data-testid="task-complete-checkbox-${editedTaskName}"]`));
    await checkbox.click();

    await driver.sleep(1500);

    taskRow = await driver.findElement(By.css(`[data-testid="task-row-${editedTaskName}"]`));
    checkbox = await taskRow.findElement(By.css(`[data-testid="task-complete-checkbox-${editedTaskName}"]`));
    await checkbox.click();
    
    await driver.sleep(1500); 
  });

  it('5. Should SHARE and UNSHARE the task', async () => {
    const taskRow = await driver.findElement(By.css(`[data-testid="task-row-${editedTaskName}"]`));
    
    const shareBtn = await taskRow.findElement(By.css(`[data-testid="share-task-button-${editedTaskName}"]`));
    await shareBtn.click();

    const selectUser = await driver.wait(until.elementLocated(By.css('[data-testid="share-users-select"]')), 5000);
    await selectUser.click();
    
    const options = await selectUser.findElements(By.css('option'));
    if (options.length > 1) {
       await options[1].click();
    }

    const modalShareBtn = await driver.findElement(By.css('[data-testid="share-user-button"]'));
    await modalShareBtn.click();

    await driver.sleep(2000);

    const removeBtn = await driver.wait(until.elementLocated(By.css('[data-testid^="share-currently-user-remove-button-"]')), 5000); 
    await removeBtn.click();

    const closeBtn = await driver.findElement(By.css('[data-testid="close-share-modal-button"]')); 
    await closeBtn.click();
    
    await driver.sleep(1000);
  });

  it('6. Should DELETE the task/category and clean up', async () => {
    const taskRow = await driver.findElement(By.css(`[data-testid="task-row-${editedTaskName}"]`));
    await taskRow.findElement(By.css(`[data-testid="delete-task-button-${editedTaskName}"]`)).click();

    const confirmBtn = await driver.wait(until.elementLocated(By.css('[data-testid="delete-modal-confirm-button"]')), 5000);
    await confirmBtn.click();
    await driver.wait(until.stalenessOf(taskRow), 5000);

    await driver.findElement(By.css('[data-testid="dashboard-manage-category-button"]')).click();

    await driver.findElement(By.css(`[data-testid="category-modal-delete-button-teste"]`)).click();
    
    await driver.sleep(2000);

    await driver.findElement(By.css('[data-testid="category-modal-close-button"]')).click();
  });

  it('7. Should DELETE the account to clean up', async () => {
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