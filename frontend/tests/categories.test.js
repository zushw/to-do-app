const { Builder, By, until } = require('selenium-webdriver');

describe('Category Lifecycle Flow', () => {
  let driver;
  const uniqueCategoryName = `Cat_${Date.now()}`;
  const editedCategoryName = `${uniqueCategoryName}_Edited`;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  afterAll(async () => { if (driver) await driver.quit(); });

  it('1. Should create an account and login', async () => {
    await driver.get('http://localhost:5173/register'); 
    await driver.findElement(By.css('[data-testid="register-username-input"]')).sendKeys("teste-cat");
    await driver.findElement(By.css('[data-testid="register-email-input"]')).sendKeys("teste-cat@teste.com");
    await driver.findElement(By.css('[data-testid="register-password-input"]')).sendKeys("s3nh@Forte");
    await driver.findElement(By.css('[data-testid="register-submit-button"]')).click();

    await driver.wait(until.urlContains('/login'), 5000);

    const userInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-username-input"]')), 5000);
    await userInput.sendKeys("teste-cat");
    await driver.findElement(By.css('[data-testid="login-password-input"]')).sendKeys("s3nh@Forte");
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 10000);
  });

  it('2. Should CREATE a category', async () => {
    await driver.findElement(By.css('[data-testid="dashboard-manage-category-button"]')).click();
    
    const catInput = await driver.wait(until.elementLocated(By.css('[data-testid="category-modal-name-input"]')), 5000);
    await driver.wait(until.elementIsVisible(catInput), 5000);
    
    await driver.sleep(500);
    await catInput.sendKeys(uniqueCategoryName);
    
    await driver.findElement(By.css('[data-testid="category-modal-add-button"]')).click();

    await driver.wait(until.elementLocated(By.css(`[data-testid="category-modal-name-${uniqueCategoryName}"]`)), 5000);
    
  });

  it('3. Should EDIT a category', async () => {
    await driver.findElement(By.css(`[data-testid="category-modal-edit-button-${uniqueCategoryName}"]`)).click();

    const catEditInput = await driver.wait(until.elementLocated(By.css(`[data-testid="category-modal-edit-input-${uniqueCategoryName}"]`)), 5000);
    await driver.wait(until.elementIsVisible(catEditInput), 5000);
    await catEditInput.clear();
    await catEditInput.sendKeys(editedCategoryName);
    
    await driver.findElement(By.css(`[data-testid="category-modal-edit-save-button-${uniqueCategoryName}"]`)).click();
    
    await driver.wait(until.elementLocated(By.css(`[data-testid="category-modal-name-${editedCategoryName}"]`)), 5000);
    await driver.sleep(1000);
  });

  it('4. Should DELETE a category', async () => {
    await driver.findElement(By.css(`[data-testid="category-modal-delete-button-${editedCategoryName}"]`)).click();
    
    await driver.sleep(2000);

    await driver.findElement(By.css('[data-testid="category-modal-close-button"]')).click();
  });

  it('5. Should DELETE the account to clean up', async () => {
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