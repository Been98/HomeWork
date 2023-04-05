#include <iostream>
#include <string>
#include <memory>
#include <ctime>
#include <cstdlib>
#include <iomanip>

using namespace std;

int main()
{
    srand(time(nullptr));
    int size;
    cout << "배열 (double) 크기를 입력하세요 >>";
    cin >> size;
    auto arr = make_unique<double[]>(size);
    for(int i =0; i <size;  i++){
        arr[i] = rand()%10+(double)rand()/(RAND_MAX);
    }

    for(int i = 0; i< size; i++){
        cout << i+1 << " ] " <<fixed<<setprecision(2)<<arr[i]<<endl;
    }
    return 0;
}
