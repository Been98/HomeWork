#include <iostream>
#include <cstring>
using namespace std;

class base{
protected:
    string model;        //모델
    string manufacturer; //제조사
    int printedCount;    //총 인쇄 매수
    int availableCount;  //인쇄 종이 잔량
public :
    //base() = default;
    base(string m,string ma,int pc, int ac);
    bool show(int pages);
};
base::base(string m,string ma,int pc, int ac){
    model = m;
    manufacturer = ma;
    printedCount = pc;
    availableCount = ac;
}
bool base::show(int pages){
    int a;
    bool flag =true;
    if (availableCount > pages)
    {
        printedCount += pages;
        cout << "프린트하였습니다." << endl;
        availableCount -= pages;
    }
    else
    {
        cout << "용지가 부족하여 프린트할 수 없습니다. " << endl
             << "용지를 추가해주세요 ";
        cin >> a;
        if (a == 0)
        {
            flag = false;
        }        
        else
        {
            availableCount += a;
            printedCount += pages;
            cout << "용지를 " << a << "추가 합니다" << endl
                 << "프린트하였습니다" << endl;
            availableCount -= pages;
        }
    }
    return flag;
}

class InkJetPrinter:public base
{
    int availableInk;    //잉크 잔량
public:
    InkJetPrinter();
    void printInkJet(int pages = 1); // pages 수만큼 용지 사용, 잉크잔량은 pages 수만큼 감소
    void showStateInkJet();          //현재 상태 출력
};
InkJetPrinter::InkJetPrinter() : base("Officejet V40", "HP", 0, 5)
{
    availableInk = 10;
    cout << "잉크젯 : ";
    showStateInkJet();
}
void  InkJetPrinter::printInkJet(int pages){
    if(show(pages))
        availableInk -= pages;
    showStateInkJet();
}
void InkJetPrinter::showStateInkJet(){
    cout << model << " ," << manufacturer << " ,인쇄 매수 " << printedCount << "장"
    << "남은 종이 " << availableCount << "장 ,남은 잉크 " << availableInk << endl;
}

class LaserPrinter:public base
{
    int availableToner;  //토너 잔량
public:
    LaserPrinter();
    void printLaser(int pages = 1); // pages 수만큼 용지 사용, 토너 잔량은 -1 감소
    void showStateLaser();          //현재 상태 출력
};
LaserPrinter::LaserPrinter() : base("SCX-6x45", "삼성전자", 0, 6){
    availableToner = 10;
    cout << "레이저 : " << model << " ," << manufacturer << " ,인쇄 매수 " << printedCount << "장, "
         << "남은 종이 " << availableCount << "장 ,남은 토너 " << availableToner<< endl;
}
void LaserPrinter::printLaser(int pages)
{
    if(show(pages)){
        availableToner--;
    }
    showStateLaser();
}
void LaserPrinter::showStateLaser()
{
    cout << model << " ," << manufacturer << " ,인쇄 매수 " << printedCount << "장, "
         << "남은 종이 " << availableCount << "장 ,남은 토너 " << availableToner << endl;
}
//- 용지가 부족하면 입력한 값만큼 추가한 후 프린트 하고, 0을 입력하면 현재 프린터 상태만 출력한다
class PrinterManager{
    InkJetPrinter *i;
    LaserPrinter *l;
    int pages;
    int num;
public:
    PrinterManager();
    void operater();
    ~PrinterManager();
};
PrinterManager::PrinterManager(){
    cout << "현재 작동중인 2 대의 프린터는 아래와 같다." << endl;
    i = new InkJetPrinter();
    l = new LaserPrinter();
}
void PrinterManager::operater(){
    char a;
    bool flag = true;
    while(flag){
        cout << "프린터(1: 잉크젯, 2: 레이저)와 매수 입력>>";
        cin>>num>>pages;
        switch (num)
        {
        case 1:
            i->printInkJet(pages);
            break;
        
        case 2:
            l->printLaser(pages);
            break;
        }
        while(true){
            cout <<"계속 프린트 하시겠습니까(y/n)>>";
            cin >> a;
            if(a == 'y'){
                flag = true;
                cout << endl;
                break;
            }
            else if(a == 'n'){
                flag = false;
                break;
            }
            else{
                cout << "다시 입력하세요. "<<endl;
                continue;
            }
        }
    }
}
PrinterManager::~PrinterManager(){
    delete i;
    delete l;
}

int main(){
    PrinterManager man;
    man.operater();
}