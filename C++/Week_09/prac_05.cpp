#include <iostream>
#include <string>

using namespace std;

//int write(Coffee *b, int size);
class Coffee
{
    string name;
    int price;

public:
    Coffee() = default;
    ~Coffee(){cout << "소멸자 실행" <<endl;}
    void setName(string n) { name = n;}
    string getName() { return name;}
    void setPrice(int p) { price = p;}
    int getPrice(){return price;}
};

int write(Coffee *b, int size);

class CoffeeMachine
{
    Coffee *orderlist;
    int count;

public:
    CoffeeMachine();
    ~CoffeeMachine(){delete[] orderlist;}
    void result();
};

CoffeeMachine::CoffeeMachine(){
    string name[5] = {"moca", "latte", "americano", "espresso", "sugarcoffee"};
    int price[5] = {2000,3000,2000,2500,1500};
    cout << "=== 메뉴 ===" <<endl;
    for(int i = 0; i < 5; i++){
        cout << i<<")"<<name[i]<<","<<price[i]<<endl;
    }
    cout << endl;
    cout << "몇 잔을 주문하시겠습니까 ?";
    cin >> count;
    orderlist = new Coffee[count];
    for(int i = 0; i < count; i ++){
        int index = -1;
        while( index > 4 || index < 0){
            cout << "구매하실 메뉴 번호를 입력하세요 : ";
            cin >> index;
        }
        orderlist[i].setName(name[index]);
        orderlist[i].setPrice(price[index]);
    }
}
void CoffeeMachine::result(){
    cout << "주문하신 메뉴는 "<<endl;
    int total = write(orderlist,count);
    cout << "합계 금액은 "<<total<<"원 입니다."<<endl<<endl;
}
int write(Coffee *b, int size)
{
    int sum = 0;
    for(int i = 0; i < size; i++){
        cout << b[i].getName()<<","<<b[i].getPrice()<<endl;
        sum += b[i].getPrice();
    }
    return sum;
}

int main()
{
    CoffeeMachine cm;
    cm.result();
    return 0;
}